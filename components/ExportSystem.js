import { useState } from 'react';

/**
 * Sistema de exportação de consultas legais em PDF
 * Permite salvar conversas e resultados para uso offline
 */
export default function ExportSystem({ messages, sessionTitle = "Consulta Legal" }) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Criar conteúdo HTML para conversão
      const htmlContent = generateHTMLContent(messages, sessionTitle);
      
      // Usar a API do navegador para imprimir/salvar como PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Aguardar carregamento e abrir dialogo de impressão
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
    } catch (error) {
      console.error('Erro na exportação:', error);
      alert('Erro ao exportar. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToText = () => {
    const textContent = generateTextContent(messages, sessionTitle);
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${sessionTitle.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: sessionTitle,
          text: generateTextContent(messages, sessionTitle, true),
          url: window.location.href
        });
      } catch (error) {
        console.log('Partilha cancelada');
      }
    } else {
      // Fallback: copiar para clipboard
      const textContent = generateTextContent(messages, sessionTitle, true);
      await navigator.clipboard.writeText(textContent);
      alert('Conteúdo copiado para a área de transferência!');
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToPDF}
        disabled={isExporting || messages.length === 0}
        className="bg-moz-red hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            A exportar...
          </>
        ) : (
          <>
            📄 PDF
          </>
        )}
      </button>

      <button
        onClick={exportToText}
        disabled={messages.length === 0}
        className="bg-moz-green hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📝 Texto
      </button>

      <button
        onClick={shareResults}
        disabled={messages.length === 0}
        className="bg-moz-yellow hover:bg-yellow-600 text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        📤 Partilhar
      </button>
    </div>
  );
}

/**
 * Gera conteúdo HTML para PDF
 */
function generateHTMLContent(messages, title) {
  const date = new Date().toLocaleDateString('pt-PT');
  const time = new Date().toLocaleTimeString('pt-PT');
  
  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8">
      <title>${title} - ${date}</title>
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #00A859; 
          padding-bottom: 10px; 
          margin-bottom: 20px;
        }
        .header h1 {
          color: #00A859;
          margin: 0;
        }
        .message { 
          margin: 15px 0; 
          padding: 10px;
          border-left: 3px solid #ccc;
        }
        .user-message { 
          border-left-color: #CE1126;
          background-color: #fef2f2;
        }
        .assistant-message { 
          border-left-color: #00A859;
          background-color: #f0fdf4;
        }
        .message-role { 
          font-weight: bold; 
          margin-bottom: 5px;
          text-transform: uppercase;
          font-size: 12px;
          color: #666;
        }
        .citation {
          background-color: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 5px;
          padding: 8px;
          margin: 8px 0;
          font-size: 14px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .message { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Muzaia - Assistente Jurídico</h1>
        <p><strong>${title}</strong></p>
        <p>Gerado em ${date} às ${time}</p>
      </div>
      
      ${messages.map((msg, index) => `
        <div class="message ${msg.role}-message">
          <div class="message-role">${msg.role === 'user' ? 'Pergunta' : 'Resposta'}:</div>
          <div>${msg.content.replace(/\n/g, '<br>')}</div>
          ${msg.citations ? msg.citations.map(citation => `
            <div class="citation">
              <strong>${citation.title}</strong><br>
              ${citation.content}<br>
              <em>Relevância: ${Math.round(citation.score * 100)}%</em>
            </div>
          `).join('') : ''}
        </div>
      `).join('')}
      
      <div class="footer">
        <p>Este documento foi gerado pelo Muzaia, Assistente Jurídico Moçambicano.</p>
        <p>As informações fornecidas têm carácter informativo e não constituem aconselhamento jurídico oficial.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Gera conteúdo em texto simples
 */
function generateTextContent(messages, title, summary = false) {
  const date = new Date().toLocaleDateString('pt-PT');
  const time = new Date().toLocaleTimeString('pt-PT');
  
  let content = `MUZAIA - ASSISTENTE JURÍDICO MOÇAMBICANO\n`;
  content += `${title}\n`;
  content += `Gerado em ${date} às ${time}\n`;
  content += `${'='.repeat(50)}\n\n`;
  
  if (summary && messages.length > 4) {
    // Versão resumida para partilha
    content += `RESUMO DA CONSULTA:\n\n`;
    content += `Pergunta: ${messages[0]?.content || 'Não disponível'}\n\n`;
    content += `Resposta: ${messages[1]?.content?.substring(0, 300) || 'Não disponível'}...\n\n`;
    content += `Total de ${messages.length} mensagens na conversa completa.\n`;
  } else {
    // Conversa completa
    messages.forEach((msg, index) => {
      content += `${msg.role === 'user' ? 'PERGUNTA' : 'RESPOSTA'}:\n`;
      content += `${msg.content}\n`;
      
      if (msg.citations) {
        content += `\nFONTES CITADAS:\n`;
        msg.citations.forEach(citation => {
          content += `- ${citation.title} (${Math.round(citation.score * 100)}% relevância)\n`;
        });
      }
      
      content += `\n${'-'.repeat(30)}\n\n`;
    });
  }
  
  content += `\nDISCLAIMER:\n`;
  content += `As informações fornecidas têm carácter informativo e não constituem aconselhamento jurídico oficial.\n`;
  content += `Para questões específicas, consulte um advogado qualificado em Moçambique.\n`;
  
  return content;
}