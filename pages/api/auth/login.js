// API route for production deployment - proxy login to auth server
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // In production, try to proxy to the auth server
    const authServerUrl = process.env.AUTH_SERVER_URL || 'http://localhost:3001';
    
    const response = await fetch(`${authServerUrl}/api/auth/login`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.cookie || '',
      },
      body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    // Forward status and headers
    res.status(response.status);
    
    // Forward cookies if present
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
      res.setHeader('Set-Cookie', setCookieHeader);
    }

    res.json(data);
  } catch (error) {
    console.error('Login proxy error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}