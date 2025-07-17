import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, session_id } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória e deve ser uma string' 
      });
    }

    // Forward request to FastAPI backend
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/send`,
      {
        message,
        session_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with error
        res.status(error.response.status).json({
          error: error.response.data?.detail || 'Erro do servidor',
          success: false
        });
      } else if (error.request) {
        // Request was made but no response received
        res.status(503).json({
          error: 'Servidor temporariamente indisponível. Tente novamente.',
          success: false
        });
      } else {
        // Something else happened
        res.status(500).json({
          error: 'Erro interno do servidor',
          success: false
        });
      }
    } else {
      res.status(500).json({
        error: 'Erro interno do servidor',
        success: false
      });
    }
  }
}
