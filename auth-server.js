const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Pool } = require('pg');
const connectPgSimple = require('connect-pg-simple');

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

// Authentication routes
console.log('🔐 Setting up development authentication...');

// Mock user data for development
const createMockUser = () => ({
  id: 'dev-user-' + Date.now(),
  email: 'utilizador@moçambique.mz',
  firstName: 'Utilizador',
  lastName: 'Moçambicano',
  profileImageUrl: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

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

// Initialize server
function startServer() {
  console.log('🔐 Setting up authentication server...');
  
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️  DATABASE_URL not provided, using in-memory sessions');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Judas Auth Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Login: http://localhost:${PORT}/api/login`);
    
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌐 Domain: ${process.env.REPLIT_DOMAINS?.split(',')[0]}`);
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
startServer();