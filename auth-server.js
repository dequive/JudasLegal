const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const connectPgSimple = require('connect-pg-simple');

const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
let pool;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log('📊 PostgreSQL connected');
}

// In-memory storage for development (replace with database queries)
const users = new Map();
const verificationCodes = new Map();

// Email/SMS setup
const emailTransporter = process.env.EMAIL_USER ? nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
}) : null;

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Helper functions
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendVerificationEmail(email, code) {
  if (!emailTransporter) {
    console.log('📧 Email not configured, verification code:', code);
    return;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de Verificação - Judas Legal Assistant',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Judas Legal Assistant</h2>
        <p>O vosso código de verificação é:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
          <h1 style="color: #1f2937; margin: 0; font-size: 32px; letter-spacing: 8px;">${code}</h1>
        </div>
        <p>Este código expira em 10 minutos.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
}

async function sendVerificationSMS(phone, code) {
  if (!twilioClient) {
    console.log('📱 SMS not configured, verification code:', code);
    return;
  }

  await twilioClient.messages.create({
    body: `Judas Legal Assistant: O vosso código de verificação é ${code}. Expira em 10 minutos.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [`https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`, 'https://workspace-eight-mocha.vercel.app']
    : ['http://localhost:5000', 'http://0.0.0.0:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
}));

// Session configuration
const PostgresStore = connectPgSimple(session);
app.use(session({
  store: pool ? new PostgresStore({ pool, createTableIfMissing: true }) : undefined,
  secret: process.env.SESSION_SECRET || 'judas-dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = users.get(id);
  done(null, user);
});

// Local strategy (email/phone + password)
passport.use(new LocalStrategy({
  usernameField: 'emailOrPhone',
  passwordField: 'password'
}, async (emailOrPhone, password, done) => {
  try {
    // Find user by email or phone
    let user = null;
    for (const [id, userData] of users) {
      if (userData.email === emailOrPhone || userData.phone === emailOrPhone) {
        user = userData;
        break;
      }
    }

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: 'Credenciais inválidas' });
    }

    user.lastLoginAt = new Date();
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Google strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = null;
      for (const [id, userData] of users) {
        if (userData.googleId === profile.id || userData.email === profile.emails?.[0]?.value) {
          user = userData;
          break;
        }
      }

      if (!user) {
        // Create new user
        const userId = uuidv4();
        user = {
          id: userId,
          email: profile.emails?.[0]?.value || null,
          firstName: profile.name?.givenName || null,
          lastName: profile.name?.familyName || null,
          profileImageUrl: profile.photos?.[0]?.value || null,
          googleId: profile.id,
          authProvider: 'google',
          isEmailVerified: true,
          lastLoginAt: new Date(),
          createdAt: new Date(),
        };
        users.set(userId, user);
      } else {
        user.lastLoginAt = new Date();
        if (!user.googleId) {
          user.googleId = profile.id;
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Judas Auth Server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    usersCount: users.size
  });
});

// Authentication Routes

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, phone, firstName, lastName, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email ou telemóvel é obrigatório' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password deve ter pelo menos 6 caracteres' });
    }

    // Check if user exists
    for (const [id, userData] of users) {
      if ((email && userData.email === email) || (phone && userData.phone === phone)) {
        return res.status(400).json({ error: 'Utilizador já existe' });
      }
    }

    // Create user
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = {
      id: userId,
      email: email || null,
      phone: phone || null,
      firstName,
      lastName,
      password: hashedPassword,
      authProvider: email ? 'email' : 'phone',
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date(),
    };

    users.set(userId, user);

    // Send verification code
    const code = generateVerificationCode();
    const codeData = {
      id: uuidv4(),
      userId,
      code,
      type: email ? 'email' : 'phone',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      isUsed: false,
    };

    verificationCodes.set(codeData.id, codeData);

    if (email) {
      await sendVerificationEmail(email, code);
    } else if (phone) {
      await sendVerificationSMS(phone, code);
    }

    res.json({ 
      message: 'Utilizador criado. Verifiquem o código enviado.',
      userId,
      verificationType: email ? 'email' : 'phone'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Verify code
app.post('/api/auth/verify', async (req, res) => {
  try {
    const { userId, code, type } = req.body;

    let verificationCode = null;
    for (const [id, codeData] of verificationCodes) {
      if (codeData.userId === userId && codeData.type === type && !codeData.isUsed) {
        verificationCode = codeData;
        break;
      }
    }

    if (!verificationCode || verificationCode.code !== code || verificationCode.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Código inválido ou expirado' });
    }

    // Mark code as used
    verificationCode.isUsed = true;

    // Update user verification status
    const user = users.get(userId);
    if (user) {
      if (type === 'email') {
        user.isEmailVerified = true;
      } else {
        user.isPhoneVerified = true;
      }
      user.updatedAt = new Date();
    }

    // Auto login
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no login automático' });
      }
      res.json({ message: 'Verificação bem-sucedida', user: { ...user, password: undefined } });
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login
app.post('/api/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Credenciais inválidas' });
    }
    
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ error: 'Erro no login' });
      }
      res.json({ message: 'Login bem-sucedido', user: { ...user, password: undefined } });
    });
  })(req, res, next);
});

// Google Auth
app.get('/api/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/api/auth/google/callback', 
  passport.authenticate('google', { 
    successRedirect: '/',
    failureRedirect: '/auth?error=google_auth_failed'
  })
);

// Get current user
app.get('/api/auth/user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Não autenticado' });
  }
  const user = { ...req.user, password: undefined };
  res.json(user);
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no logout' });
    }
    res.json({ message: 'Logout bem-sucedido' });
  });
});

// Resend verification code
app.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { userId, type } = req.body;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilizador não encontrado' });
    }

    const code = generateVerificationCode();
    const codeData = {
      id: uuidv4(),
      userId,
      code,
      type,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      isUsed: false,
    };

    verificationCodes.set(codeData.id, codeData);

    if (type === 'email' && user.email) {
      await sendVerificationEmail(user.email, code);
    } else if (type === 'phone' && user.phone) {
      await sendVerificationSMS(user.phone, code);
    }

    res.json({ message: 'Código reenviado' });
  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Start server
function startServer() {
  console.log('🔐 Setting up MuzaIA authentication server...');
  
  app.listen(PORT, () => {
    console.log(`🚀 MuzaIA Auth Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Authentication: http://localhost:${PORT}/api/auth`);
    console.log(`🔐 Google Auth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
    console.log(`📱 SMS: ${process.env.TWILIO_ACCOUNT_SID ? 'Configured' : 'Not configured'}`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down auth server gracefully...');
  process.exit(0);
});

// Start the server
startServer();