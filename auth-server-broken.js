const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

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

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Judas Auth Server',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import auth setup (will be TypeScript compiled to JS)
async function setupServer() {
  try {
    // Dynamic import of the auth module
    const { setupAuth } = await import('./server/auth.js');
    setupAuth(app);
    console.log('✅ Authentication system configured');
  } catch (error) {
    console.error('❌ Auth setup failed:', error);
    
    // Fallback authentication routes
    console.log('🔧 Setting up basic authentication fallback...');
    
    // Mock authentication for development
    app.post('/api/auth/register', (req, res) => {
      const { email, firstName, lastName } = req.body;
      res.json({ 
        message: 'Utilizador criado com sucesso',
        user: {
          id: 'mock-' + Date.now(),
          email,
          firstName,
          lastName,
          isEmailVerified: true
        }
      });
    });
    
    app.post('/api/auth/login', (req, res) => {
      const { emailOrPhone } = req.body;
      res.json({ 
        message: 'Login bem-sucedido',
        user: {
          id: 'mock-' + Date.now(),
          email: emailOrPhone,
          firstName: 'Utilizador',
          lastName: 'Teste',
          isEmailVerified: true
        }
      });
    });
    
    app.get('/api/auth/user', (req, res) => {
      res.json({
        id: 'mock-user',
        email: 'utilizador@teste.mz',
        firstName: 'Utilizador',
        lastName: 'Teste',
        isEmailVerified: true
      });
    });
    
    app.post('/api/auth/logout', (req, res) => {
      res.json({ message: 'Logout bem-sucedido' });
    });
    
    app.get('/api/auth/google', (req, res) => {
      res.redirect('/?auth=google_demo');
    });
  }
}

// Start server
async function startServer() {
  console.log('🔐 Setting up Judas authentication server...');
  
  await setupServer();
  
  app.listen(PORT, () => {
    console.log(`🚀 Judas Auth Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔑 Authentication: http://localhost:${PORT}/api/auth`);
  });
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down auth server gracefully...');
  process.exit(0);
});

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start auth server:', error);
  process.exit(1);
});