export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Sobre o Judas</h3>
            <p className="text-gray-300 text-sm">
              Assistente jurídico inteligente para democratizar o acesso à informação legal em Moçambique. 
              Desenvolvido com tecnologia RAG para fornecer respostas precisas com fontes verificadas.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Funcionalidades</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Consultas em português</li>
              <li>• Citações verificadas</li>
              <li>• Funcionalidade offline</li>
              <li>• Interface responsiva</li>
              <li>• Histórico de conversas</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Importante</h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>
                ⚖️ Este assistente fornece informações gerais sobre legislação moçambicana.
              </p>
              <p>
                📋 Não substitui consulta jurídica profissional.
              </p>
              <p>
                🔍 Sempre verifique as fontes citadas.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2024 Judas - Assistente Jurídico Moçambicano. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">
              Desenvolvido para democratizar o acesso à justiça
            </span>
            <div className="flex space-x-1">
              <span className="text-moz-green">🇲🇿</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
