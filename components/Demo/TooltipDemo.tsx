import React from 'react';
import TextWithTooltips from '../TextWithTooltips';

const TooltipDemo: React.FC = () => {
  const demoTexts = [
    "O mandado de segurança é uma ação constitucional que protege direitos fundamentais contra atos ilegais da administração pública.",
    "Em caso de flagrante delito, qualquer pessoa pode efetuar a prisão, devendo entregar imediatamente o suspeito à autoridade competente.",
    "A usucapião permite adquirir a propriedade de um bem pela posse prolongada e pacífica, respeitando os prazos estabelecidos em lei.",
    "O divórcio por justa causa pode ser solicitado quando há violação grave dos deveres conjugais, conforme previsto no Código da Família.",
    "A capacidade civil plena é adquirida aos 18 anos, permitindo ao indivíduo exercer todos os atos da vida civil sem necessidade de representação.",
    "O dolo caracteriza-se pela intenção consciente de praticar um crime, diferindo da culpa, que é a conduta negligente sem intenção criminosa.",
    "A sociedade anónima tem o capital dividido em ações e a responsabilidade dos sócios limitada ao valor das ações subscritas.",
    "O recurso de apelação deve ser interposto no prazo legal para impugnar decisões judiciais perante o tribunal superior.",
    "Os alimentos são devidos entre parentes em linha reta e entre cônjuges, visando garantir o sustento necessário à sobrevivência digna."
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Demonstração de Tooltips Jurídicos
        </h1>
        <p className="text-lg text-gray-600">
          Passe o mouse sobre os termos jurídicos destacados para ver suas explicações
        </p>
      </div>

      <div className="space-y-4">
        {demoTexts.map((text, index) => (
          <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <TextWithTooltips 
              text={text}
              className="text-gray-800 leading-relaxed"
            />
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Como usar os tooltips:
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Passe o mouse sobre termos jurídicos destacados com linha pontilhada</li>
          <li>• Clique ou use Tab para navegar com o teclado</li>
          <li>• Cada tooltip mostra: definição, categoria, exemplos e termos relacionados</li>
          <li>• As cores indicam diferentes áreas do direito</li>
        </ul>
      </div>
    </div>
  );
};

export default TooltipDemo;