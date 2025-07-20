import { useState, useEffect } from 'react';
import { AlertTriangle, X, Info, Scale, Shield } from 'lucide-react';

export default function LegalDisclaimer({ type = 'footer', variant = 'warning' }) {
  const [isVisible, setIsVisible] = useState(true);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Para modal, verificar se já foi mostrado na sessão
    if (type === 'modal') {
      const shown = sessionStorage.getItem('legal-disclaimer-shown');
      if (!shown) {
        setIsVisible(true);
        setHasShown(false);
      } else {
        setIsVisible(false);
        setHasShown(true);
      }
    }
  }, [type]);

  const handleClose = () => {
    setIsVisible(false);
    if (type === 'modal') {
      sessionStorage.setItem('legal-disclaimer-shown', 'true');
      setHasShown(true);
    }
  };

  const disclaimerContent = {
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      title: "Aviso Legal Importante",
      message: "O Muzaia pode cometer erros. Verifique sempre informações importantes.",
      color: "bg-red-50 border-red-200 text-red-800"
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      title: "Informação Legal",
      message: "Este assistente fornece informações gerais. Consulte sempre um advogado para questões específicas.",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    professional: {
      icon: <Scale className="w-5 h-5 text-purple-500" />,
      title: "Responsabilidade Profissional",
      message: "As respostas são baseadas em documentos legais, mas não substituem aconselhamento jurídico profissional.",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    }
  };

  const content = disclaimerContent[variant];

  if (type === 'footer') {
    return (
      <div className={`w-full border ${content.color} p-3 rounded-lg`}>
        <div className="flex items-center gap-3">
          {content.icon}
          <div className="flex-1">
            <p className="text-sm font-medium">{content.title}</p>
            <p className="text-xs mt-1">{content.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'banner' && isVisible) {
    return (
      <div className={`w-full border-l-4 ${
        variant === 'warning' ? 'border-red-500 bg-red-50' :
        variant === 'info' ? 'border-blue-500 bg-blue-50' :
        'border-purple-500 bg-purple-50'
      } p-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {content.icon}
            <div>
              <h4 className={`font-semibold ${
                variant === 'warning' ? 'text-red-800' :
                variant === 'info' ? 'text-blue-800' :
                'text-purple-800'
              }`}>
                {content.title}
              </h4>
              <p className={`text-sm mt-1 ${
                variant === 'warning' ? 'text-red-700' :
                variant === 'info' ? 'text-blue-700' :
                'text-purple-700'
              }`}>
                {content.message}
              </p>
              <div className="mt-2 text-xs text-gray-600">
                <p>• Este sistema utiliza inteligência artificial para processar informações legais</p>
                <p>• As respostas podem conter imprecisões ou estar desactualizadas</p>
                <p>• Sempre consulte um profissional qualificado para questões jurídicas importantes</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (type === 'modal' && isVisible && !hasShown) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">Aviso Legal Obrigatório</h2>
            </div>
            
            <div className="space-y-4 text-gray-700">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-red-800">Limitações do Sistema</span>
                </div>
                <p className="text-sm text-red-700">
                  O Muzaia é um assistente de IA que pode cometer erros, fornecer informações 
                  desactualizadas ou incompletas sobre questões legais.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-blue-800">Não Substitui Aconselhamento Profissional</span>
                </div>
                <p className="text-sm text-blue-700">
                  As informações fornecidas são apenas para fins educativos e não constituem 
                  aconselhamento jurídico profissional.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold text-purple-800">Recomendação</span>
                </div>
                <p className="text-sm text-purple-700">
                  Para questões jurídicas importantes, consulte sempre um advogado 
                  qualificado em Moçambique.
                </p>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4">
                Este aviso será exibido uma vez por sessão
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Compreendi e Aceito
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Componente para aviso específico em respostas da IA
export function AIResponseDisclaimer({ severity = 'high' }) {
  const severityConfig = {
    high: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: <AlertTriangle className="w-4 h-4 text-red-600" />
    },
    medium: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: <Info className="w-4 h-4 text-yellow-600" />
    },
    low: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: <Info className="w-4 h-4 text-blue-600" />
    }
  };

  const config = severityConfig[severity];

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-3 mt-3`}>
      <div className="flex items-start gap-2">
        {config.icon}
        <div className="flex-1">
          <p className={`text-xs font-medium ${config.text}`}>
            ⚠️ Verificação Recomendada
          </p>
          <p className={`text-xs ${config.text} mt-1`}>
            Esta resposta foi gerada por IA. Verifique sempre informações importantes 
            com fontes oficiais ou profissionais qualificados.
          </p>
        </div>
      </div>
    </div>
  );
}

// Hook para gerenciar avisos legais
export function useLegalDisclaimer() {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem('legal-disclaimer-shown');
    if (!shown) {
      setShouldShowModal(true);
    }
  }, []);

  const markAsShown = () => {
    sessionStorage.setItem('legal-disclaimer-shown', 'true');
    setShouldShowModal(false);
  };

  const resetDisclaimer = () => {
    sessionStorage.removeItem('legal-disclaimer-shown');
    setShouldShowModal(true);
  };

  return {
    shouldShowModal,
    markAsShown,
    resetDisclaimer
  };
}