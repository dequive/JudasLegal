import { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

/**
 * Sistema de feedback para melhorar respostas da IA
 * Permite aos utilizadores avaliar a qualidade das respostas
 */
export default function FeedbackSystem({ messageId, initialResponse }) {
  const [feedback, setFeedback] = useLocalStorage('muzaia_feedback', {});
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(!!feedback[messageId]);

  const submitFeedback = () => {
    const feedbackData = {
      messageId,
      rating,
      comment,
      timestamp: new Date().toISOString(),
      response: initialResponse
    };

    setFeedback(prev => ({ ...prev, [messageId]: feedbackData }));
    setSubmitted(true);
    setShowFeedbackForm(false);

    // Em produção, enviar para analytics
    console.log('Feedback enviado:', feedbackData);
  };

  if (submitted) {
    return (
      <div className="text-xs text-gray-400 mt-2">
        ✓ Feedback enviado. Obrigado por ajudar a melhorar o Muzaia!
      </div>
    );
  }

  return (
    <div className="mt-2">
      {!showFeedbackForm ? (
        <button
          onClick={() => setShowFeedbackForm(true)}
          className="text-xs text-gray-400 hover:text-gray-300 transition-colors no-print"
        >
          📝 Avaliar resposta
        </button>
      ) : (
        <div className="bg-gray-800/50 p-3 rounded-lg mt-2 border border-gray-700 no-print">
          <p className="text-sm text-gray-300 mb-2">Como avalia esta resposta?</p>
          
          {/* Rating stars */}
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-lg transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-600'
                } hover:text-yellow-300`}
              >
                ⭐
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comentário opcional (ex: faltou informação sobre...)"
            className="w-full bg-gray-700 text-white rounded px-3 py-2 text-sm resize-none"
            rows={2}
          />

          {/* Actions */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={submitFeedback}
              disabled={rating === 0}
              className="bg-moz-green hover:bg-green-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Enviar
            </button>
            <button
              onClick={() => setShowFeedbackForm(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Componente para mostrar estatísticas de feedback
 */
export function FeedbackStats() {
  const [feedback] = useLocalStorage('muzaia_feedback', {});
  
  const feedbackList = Object.values(feedback);
  const totalFeedback = feedbackList.length;
  const averageRating = totalFeedback > 0 
    ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / totalFeedback).toFixed(1)
    : 0;

  if (totalFeedback === 0) {
    return (
      <div className="text-center text-gray-400 py-4">
        Nenhum feedback ainda
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Estatísticas de Feedback</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-moz-green">{totalFeedback}</div>
          <div className="text-sm text-gray-400">Avaliações</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-moz-yellow">{averageRating}⭐</div>
          <div className="text-sm text-gray-400">Média</div>
        </div>
      </div>

      {/* Rating distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = feedbackList.filter(f => f.rating === rating).length;
          const percentage = totalFeedback > 0 ? (count / totalFeedback) * 100 : 0;
          
          return (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="text-gray-300 w-8">{rating}⭐</span>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-moz-green h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-gray-400 w-8">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}