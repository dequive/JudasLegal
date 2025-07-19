const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Pool } = require('pg');
const connectPgSimple = require('connect-pg-simple');

const app = express();
const PORT = 3001;

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://' + process.env.REPLIT_DOMAINS?.split(',')[0]
    : 'http://localhost:5000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Session setup
const pgStore = connectPgSimple(session);
app.use(session({
  store: new pgStore({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: false,
  }),
  secret: process.env.SESSION_SECRET || 'fallback-secret-key',
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

// Routes básicas
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'judas-auth-server' });
});

app.get('/api/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Simple authentication setup for development
console.log('Setting up development authentication');

app.get('/api/login', (req, res) => {
  const testUser = { 
    id: 'test-user-' + Date.now(), 
    email: 'usuario@exemplo.com', 
    firstName: 'Usuário', 
    lastName: 'Teste',
    profileImageUrl: null
  };
  req.login(testUser, (err) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Login failed' });
    }
    console.log('User logged in:', testUser);
    res.redirect('http://localhost:5000');
  });
});

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    console.log('User logged out');
    res.redirect('http://localhost:5000');
  });
});

app.get('/api/callback', (req, res) => {
  // For development, redirect to main app
  res.redirect('http://localhost:5000');
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});