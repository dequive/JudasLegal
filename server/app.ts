import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.REPLIT_DOMAINS?.split(',').map(domain => `https://${domain}`) 
    : ["http://localhost:3000", "http://localhost:5000"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "judas-auth-server" });
});

export async function startServer() {
  const server = await registerRoutes(app);
  const port = process.env.PORT || 3001;
  
  server.listen(port, () => {
    console.log(`Auth server running on port ${port}`);
  });
  
  return server;
}

export default app;