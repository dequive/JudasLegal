import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { v4 as uuidv4 } from "uuid";
import { storage } from "./storage";
import { User as SelectUser, InsertUser } from "../shared/schema";
import connectPgSimple from "connect-pg-simple";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Twilio configuration
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Password hashing
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  return await bcrypt.compare(supplied, stored);
}

// Generate verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send verification email
async function sendVerificationEmail(email: string, code: string): Promise<void> {
  if (!process.env.EMAIL_USER) {
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
        <p style="color: #6b7280;">Se não solicitaram este código, podem ignorar este email.</p>
      </div>
    `,
  };

  await emailTransporter.sendMail(mailOptions);
}

// Send verification SMS
async function sendVerificationSMS(phone: string, code: string): Promise<void> {
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

export function setupAuth(app: Express) {
  const PostgresStore = connectPgSimple(session);
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
    store: new PostgresStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Local Strategy (Email/Phone + Password)
  passport.use(new LocalStrategy({
    usernameField: 'emailOrPhone',
    passwordField: 'password'
  }, async (emailOrPhone, password, done) => {
    try {
      let user;
      
      // Check if it's an email or phone
      if (emailOrPhone.includes('@')) {
        user = await storage.getUserByEmail(emailOrPhone);
      } else {
        user = await storage.getUserByPhone(emailOrPhone);
      }

      if (!user || !user.password || !(await comparePasswords(password, user.password))) {
        return done(null, false, { message: 'Credenciais inválidas' });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (!user) {
          // Check if user exists with same email
          const existingUser = profile.emails?.[0]?.value 
            ? await storage.getUserByEmail(profile.emails[0].value)
            : null;
            
          if (existingUser) {
            // Link Google account to existing user
            user = await storage.updateUser(existingUser.id, {
              googleId: profile.id,
              authProvider: 'google',
              isEmailVerified: true,
              lastLoginAt: new Date(),
            });
          } else {
            // Create new user
            user = await storage.createUser({
              id: uuidv4(),
              email: profile.emails?.[0]?.value || null,
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              profileImageUrl: profile.photos?.[0]?.value || null,
              googleId: profile.id,
              authProvider: 'google',
              isEmailVerified: true,
              lastLoginAt: new Date(),
            });
          }
        } else {
          // Update last login
          await storage.updateUser(user.id, { lastLoginAt: new Date() });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }));
  }

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication Routes

  // Register with email
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, phone, firstName, lastName, password } = req.body;

      if (!email && !phone) {
        return res.status(400).json({ error: 'Email ou telemóvel é obrigatório' });
      }

      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password deve ter pelo menos 6 caracteres' });
      }

      // Check if user already exists
      const existingUser = email 
        ? await storage.getUserByEmail(email)
        : await storage.getUserByPhone(phone!);

      if (existingUser) {
        return res.status(400).json({ error: 'Utilizador já existe' });
      }

      // Create user
      const hashedPassword = await hashPassword(password);
      const userId = uuidv4();
      
      const user = await storage.createUser({
        id: userId,
        email: email || null,
        phone: phone || null,
        firstName,
        lastName,
        password: hashedPassword,
        authProvider: email ? 'email' : 'phone',
      });

      // Send verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createVerificationCode({
        id: uuidv4(),
        userId: user.id,
        code,
        type: email ? 'email' : 'phone',
        expiresAt,
      });

      if (email) {
        await sendVerificationEmail(email, code);
      } else if (phone) {
        await sendVerificationSMS(phone, code);
      }

      res.json({ 
        message: 'Utilizador criado. Verifiquem o código enviado.',
        userId: user.id,
        verificationType: email ? 'email' : 'phone'
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Verify code
  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { userId, code, type } = req.body;

      const verificationCode = await storage.getVerificationCode(userId, type);
      
      if (!verificationCode || verificationCode.code !== code || verificationCode.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Código inválido ou expirado' });
      }

      // Mark code as used
      await storage.markCodeAsUsed(verificationCode.id);

      // Update user verification status
      const updates = type === 'email' 
        ? { isEmailVerified: true }
        : { isPhoneVerified: true };
        
      const user = await storage.updateUser(userId, updates);

      // Auto login
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Erro no login automático' });
        }
        res.json({ message: 'Verificação bem-sucedida', user });
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Login
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
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
        res.json({ message: 'Login bem-sucedido', user });
      });
    })(req, res, next);
  });

  // Google Auth
  app.get("/api/auth/google", 
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get("/api/auth/google/callback", 
    passport.authenticate('google', { 
      successRedirect: '/',
      failureRedirect: '/auth?error=google_auth_failed'
    })
  );

  // Get current user
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Não autenticado' });
    }
    res.json(req.user);
  });

  // Logout
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: 'Erro no logout' });
      }
      res.json({ message: 'Logout bem-sucedido' });
    });
  });

  // Resend verification code
  app.post("/api/auth/resend-code", async (req, res) => {
    try {
      const { userId, type } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'Utilizador não encontrado' });
      }

      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await storage.createVerificationCode({
        id: uuidv4(),
        userId: user.id,
        code,
        type,
        expiresAt,
      });

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

  // Password reset request
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { emailOrPhone } = req.body;
      
      let user;
      if (emailOrPhone.includes('@')) {
        user = await storage.getUserByEmail(emailOrPhone);
      } else {
        user = await storage.getUserByPhone(emailOrPhone);
      }

      if (!user) {
        return res.status(404).json({ error: 'Utilizador não encontrado' });
      }

      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await storage.createVerificationCode({
        id: uuidv4(),
        userId: user.id,
        code,
        type: 'reset',
        expiresAt,
      });

      if (user.email && emailOrPhone.includes('@')) {
        await sendVerificationEmail(user.email, code);
      } else if (user.phone) {
        await sendVerificationSMS(user.phone, code);
      }

      res.json({ 
        message: 'Código de reset enviado',
        userId: user.id
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });

  // Reset password
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { userId, code, newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password deve ter pelo menos 6 caracteres' });
      }

      const verificationCode = await storage.getVerificationCode(userId, 'reset');
      
      if (!verificationCode || verificationCode.code !== code || verificationCode.expiresAt < new Date()) {
        return res.status(400).json({ error: 'Código inválido ou expirado' });
      }

      // Mark code as used
      await storage.markCodeAsUsed(verificationCode.id);

      // Update password
      const hashedPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, { password: hashedPassword });

      res.json({ message: 'Password actualizada com sucesso' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  });
}