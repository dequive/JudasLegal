import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { User, Scale, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import TextWithTooltips from '../TextWithTooltips';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

interface Citation {
  id: number;
  title: string;
  source: string;
  law_type: string;
  article_number?: string;
  relevance_score: number;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  const formatTime = (date: Date) => {
    try {
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch (error) {
      return 'agora';
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`flex group ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-4xl w-full ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3 ${isUser ? 'space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
            isUser 
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' 
              : 'bg-gradient-to-r from-gray-600 to-gray-700 text-white'
          }`}>
            {isUser ? (
              <User className="w-5 h-5" />
            ) : (
              <Scale className="w-5 h-5" />
            )}
          </div>
        </div>
        
        {/* Message content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {/* Message header */}
          <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-sm font-medium text-gray-600">
              {isUser ? 'Você' : 'Judas'}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {formatTime(message.timestamp)}
            </span>
            {/* Copy button */}
            <button
              onClick={copyToClipboard}
              className={`ml-2 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-gray-100 ${
                copied ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Copiar mensagem"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Message bubble */}
          <div className={`relative inline-block max-w-full ${
            isUser 
              ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white' 
              : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
          } rounded-2xl px-6 py-4 ${
            isUser ? 'rounded-br-md' : 'rounded-bl-md'
          }`}>
            {/* Message content */}
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, index) => (
                <p key={index} className={`${index === 0 ? 'mb-3' : 'mb-3'} last:mb-0 leading-relaxed ${
                  isUser ? 'text-white' : 'text-gray-800'
                }`}>
                  {isAssistant ? (
                    <TextWithTooltips text={line} />
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>

            {/* Decorative tail */}
            <div className={`absolute bottom-0 ${
              isUser 
                ? 'right-0 transform translate-x-1 translate-y-1' 
                : 'left-0 transform -translate-x-1 translate-y-1'
            }`}>
              <div className={`w-4 h-4 ${
                isUser 
                  ? 'bg-gradient-to-r from-emerald-500 to-blue-500' 
                  : 'bg-white border-l border-b border-gray-200'
              } transform rotate-45`}></div>
            </div>
          </div>

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-600 mb-3">
                📚 Fontes Jurídicas:
              </p>
              <div className="grid gap-3">
                {message.citations.map((citation) => (
                  <div 
                    key={citation.id} 
                    className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200/50 rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-2">
                          {citation.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg font-medium">
                            {citation.law_type}
                          </span>
                          {citation.article_number && (
                            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-medium">
                              Art. {citation.article_number}
                            </span>
                          )}
                          <span className="text-gray-500">
                            {citation.source}
                          </span>
                        </div>
                      </div>
                      <div className="ml-3 flex items-center">
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">Relevância</div>
                          <div className="flex items-center">
                            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transition-all duration-300"
                                style={{ width: `${citation.relevance_score * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 ml-2">
                              {Math.round(citation.relevance_score * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}