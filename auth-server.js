const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Pool } = require('pg');
const connectPgSimple = require('connect-pg-simple');
const memoize = require('memoizee');

// Dynamic import for ES modules
let openidClient;
let OpenIDStrategy;

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [`https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`]
    : ['http://localhost:5000', 'http://localhost:3000'];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'judas-auth-server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Session setup
const pgStore = connectPgSimple(session);
app.use(session({
  store: new pgStore({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET || 'judas-development-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Initialize OpenID Client modules
async function initializeOpenIDClient() {
  if (!openidClient) {
    openidClient = await import('openid-client');
    OpenIDStrategy = await import('openid-client/passport');
  }
}

// Replit Auth Setup
const getOidcConfig = memoize(
  async () => {
    await initializeOpenIDClient();
    return await openidClient.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1000 }
);

function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

// Authentication setup
async function setupAuth() {
  // Check if we're in development or if Replit Auth is not configured
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const hasReplitConfig = process.env.REPL_ID && process.env.REPLIT_DOMAINS;
  
  if (isDevelopment || !hasReplitConfig) {
    console.log('🔧 Using development mode with mock authentication');
    return setupMockAuth();
  }

  console.log('🔐 Setting up Replit Auth for production...');
  
  try {
    await initializeOpenIDClient();
    const config = await getOidcConfig();

    const verify = async (tokens, verified) => {
      const user = {};
      updateUserSession(user, tokens);
      verified(null, user);
    };

    for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
      const strategy = new OpenIDStrategy.Strategy(
        {
          name: `replitauth:${domain}`,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
    }

    // Replit Auth routes
    app.get("/api/login", (req, res, next) => {
      const hostname = req.hostname;
      const strategyName = `replitauth:${hostname}`;
      
      // Check if strategy exists for this hostname
      if (passport._strategies[strategyName]) {
        passport.authenticate(strategyName, {
          prompt: "login consent",
          scope: ["openid", "email", "profile", "offline_access"],
        })(req, res, next);
      } else {
        console.log(`⚠️ No Replit Auth strategy for hostname: ${hostname}, falling back to mock auth`);
        // Fallback to mock auth for unsupported domains
        const testUser = createMockUser();
        req.login(testUser, (err) => {
          if (err) {
            console.error('Login error:', err);
            return res.status(500).json({ error: 'Login failed' });
          }
          console.log('✅ User logged in (mock):', testUser.email);
          res.redirect('/');
        });
      }
    });

    app.get("/api/callback", (req, res, next) => {
      const hostname = req.hostname;
      const strategyName = `replitauth:${hostname}`;
      
      if (passport._strategies[strategyName]) {
        passport.authenticate(strategyName, {
          successReturnToOrRedirect: "/",
          failureRedirect: "/api/login",
        })(req, res, next);
      } else {
        // Fallback for development
        res.redirect('/');
      }
    });

    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        res.redirect(
          openidClient.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });

  } catch (error) {
    console.error('❌ Replit Auth setup failed:', error);
    console.log('🔧 Falling back to mock authentication');
    setupMockAuth();
  }
}

// Mock user helper
const createMockUser = () => ({
  id: 'dev-user-' + Date.now(),
  email: 'utilizador@mozambique.mz',
  firstName: 'Utilizador',
  lastName: 'Moçambicano',
  profileImageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

function setupMockAuth() {
  console.log('🔧 Setting up mock authentication for development');

  app.get('/api/login', (req, res) => {
    const testUser = createMockUser();
    req.login(testUser, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Login failed' });
      }
      console.log('✅ User logged in:', testUser.email);
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`
        : 'http://localhost:5000';
      res.redirect(redirectUrl);
    });
  });

  app.get('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      console.log('👋 User logged out');
      const redirectUrl = process.env.NODE_ENV === 'production' 
        ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`
        : 'http://localhost:5000';
      res.redirect(redirectUrl);
    });
  });

  app.get('/api/callback', (req, res) => {
    const redirectUrl = process.env.NODE_ENV === 'production' 
      ? `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`
      : 'http://localhost:5000';
    res.redirect(redirectUrl);
  });
}

// Common auth routes
app.get('/api/auth/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const user = req.user;
  
  // If using Replit Auth, check token expiry and refresh if needed
  if (user.expires_at && user.refresh_token) {
    const now = Math.floor(Date.now() / 1000);
    if (now > user.expires_at) {
      try {
        await initializeOpenIDClient();
        const config = await getOidcConfig();
        const tokenResponse = await openidClient.refreshTokenGrant(config, user.refresh_token);
        updateUserSession(user, tokenResponse);
      } catch (error) {
        console.error('Token refresh failed:', error);
        return res.status(401).json({ message: 'Token expired' });
      }
    }
    
    // Return user data from claims
    const claims = user.claims || {};
    res.json({
      id: claims.sub || user.id,
      email: claims.email || user.email,
      firstName: claims.first_name || user.firstName,
      lastName: claims.last_name || user.lastName,
      profileImageUrl: claims.profile_image_url || user.profileImageUrl,
    });
  } else {
    // Mock user data
    res.json(user);
  }
});

// Initialize server
async function startServer() {
  console.log('🔐 Setting up authentication server...');
  
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not provided, using in-memory sessions');
  }

  // Setup authentication
  await setupAuth();

  app.listen(PORT, () => {
    console.log(`🚀 Judas Auth Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Login: http://localhost:${PORT}/api/login`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌐 Domain: ${process.env.REPLIT_DOMAINS?.split(',')[0]}`);
      console.log(`🔐 REPL_ID: ${process.env.REPL_ID}`);
    }
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down auth server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down auth server gracefully...');
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start auth server:', error);
  process.exit(1);
});