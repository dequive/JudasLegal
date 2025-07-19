// Glossário de termos jurídicos moçambicanos
export interface LegalTerm {
  term: string;
  definition: string;
  category: 'civil' | 'penal' | 'trabalho' | 'comercial' | 'constitucional' | 'processual' | 'familiar';
  examples?: string[];
  relatedTerms?: string[];
}

export const legalGlossary: LegalTerm[] = [
  // Termos Constitucionais
  {
    term: "habeas corpus",
    definition: "Ordem judicial que protege o direito de liberdade de locomoção contra prisão ilegal ou abusiva.",
    category: "constitucional",
    examples: ["Pode ser solicitado quando alguém é preso sem mandado judicial válido"]
  },
  {
    term: "mandado de segurança",
    definition: "Ação constitucional para proteger direito líquido e certo não amparado por habeas corpus.",
    category: "constitucional",
    examples: ["Usado para contestar atos administrativos ilegais"]
  },
  {
    term: "direitos fundamentais",
    definition: "Direitos básicos e essenciais reconhecidos pela Constituição, como vida, liberdade e dignidade.",
    category: "constitucional",
    relatedTerms: ["direitos humanos", "garantias constitucionais"]
  },

  // Termos de Direito Civil
  {
    term: "pessoa jurídica",
    definition: "Entidade criada pelo direito que possui capacidade para ter direitos e obrigações, como empresas e associações.",
    category: "civil",
    examples: ["Empresas, ONGs, cooperativas"]
  },
  {
    term: "capacidade civil",
    definition: "Aptidão legal para exercer direitos e assumir obrigações na vida civil.",
    category: "civil",
    examples: ["Menores de idade têm capacidade civil relativa"]
  },
  {
    term: "usucapião",
    definition: "Forma de adquirir a propriedade pela posse prolongada e pacífica de um bem.",
    category: "civil",
    examples: ["Após 15 anos de posse mansa e pacífica pode requerer usucapião"]
  },
  {
    term: "servidão",
    definition: "Direito real que permite usar propriedade alheia para determinada finalidade.",
    category: "civil",
    examples: ["Servidão de passagem para acesso a propriedade"]
  },

  // Termos de Direito Penal
  {
    term: "dolo",
    definition: "Intenção deliberada de cometer um crime, com conhecimento da ilicitude do ato.",
    category: "penal",
    relatedTerms: ["culpa", "crime doloso"]
  },
  {
    term: "culpa",
    definition: "Conduta negligente, imprudente ou imperita que resulta em crime sem intenção.",
    category: "penal",
    examples: ["Acidente de trânsito por excesso de velocidade"]
  },
  {
    term: "legítima defesa",
    definition: "Direito de repelir injusta agressão, atual ou iminente, usando meios necessários e moderados.",
    category: "penal",
    examples: ["Defender-se de um assalto usando força proporcional"]
  },
  {
    term: "flagrante delito",
    definition: "Crime que está sendo cometido ou acabou de ser cometido, permitindo prisão sem mandado.",
    category: "penal"
  },

  // Termos de Direito do Trabalho
  {
    term: "justa causa",
    definition: "Motivo grave que permite rescisão imediata do contrato de trabalho sem direito a indenizações.",
    category: "trabalho",
    examples: ["Roubo, embriaguez habitual, insubordinação grave"]
  },
  {
    term: "acordo coletivo",
    definition: "Instrumento normativo celebrado entre sindicatos de trabalhadores e empregadores.",
    category: "trabalho",
    relatedTerms: ["convenção coletiva", "dissídio coletivo"]
  },
  {
    term: "adicional noturno",
    definition: "Acréscimo salarial devido ao trabalho realizado no período noturno.",
    category: "trabalho",
    examples: ["20% sobre o valor da hora normal em Moçambique"]
  },

  // Termos de Direito Comercial
  {
    term: "sociedade anónima",
    definition: "Tipo de empresa cujo capital está dividido em ações e a responsabilidade dos sócios é limitada.",
    category: "comercial",
    examples: ["Bancos, grandes empresas públicas"]
  },
  {
    term: "falência",
    definition: "Processo judicial para liquidação de empresa que não pode pagar suas dívidas.",
    category: "comercial",
    relatedTerms: ["insolvência", "concordata"]
  },
  {
    term: "título de crédito",
    definition: "Documento que representa direito de crédito, como cheques, promissórias e letras de câmbio.",
    category: "comercial",
    examples: ["Cheque, promissória, letra de câmbio"]
  },

  // Termos Processuais
  {
    term: "citação",
    definition: "Ato processual que convoca o réu para responder à ação judicial.",
    category: "processual",
    examples: ["Citação para contestar uma ação de cobrança"]
  },
  {
    term: "recurso de apelação",
    definition: "Meio de impugnar decisão judicial perante tribunal superior.",
    category: "processual",
    relatedTerms: ["recurso ordinário", "segunda instância"]
  },
  {
    term: "liminar",
    definition: "Decisão judicial provisória e urgente que antecipa efeitos da sentença final.",
    category: "processual",
    examples: ["Liminar para suspender demissão até julgamento final"]
  },
  {
    term: "competência",
    definition: "Poder legal do juiz ou tribunal para julgar determinada causa.",
    category: "processual",
    examples: ["Competência territorial, competência por matéria"]
  },

  // Termos de Direito da Família
  {
    term: "pátrio poder",
    definition: "Conjunto de direitos e deveres dos pais em relação aos filhos menores.",
    category: "familiar",
    relatedTerms: ["poder familiar", "guarda"]
  },
  {
    term: "regime de bens",
    definition: "Regras que definem como serão administrados os bens do casal durante o casamento.",
    category: "familiar",
    examples: ["Comunhão total, comunhão parcial, separação de bens"]
  },
  {
    term: "alimentos",
    definition: "Prestação para sustento, habitação, vestuário e assistência médica.",
    category: "familiar",
    examples: ["Pensão alimentícia para filhos ou ex-cônjuge"]
  }
];

// Função para buscar definição de um termo
export const findLegalTerm = (term: string): LegalTerm | undefined => {
  const normalizedTerm = term.toLowerCase().trim();
  return legalGlossary.find(item => 
    item.term.toLowerCase() === normalizedTerm ||
    item.relatedTerms?.some(related => related.toLowerCase() === normalizedTerm)
  );
};

// Função para buscar termos por categoria
export const getTermsByCategory = (category: LegalTerm['category']): LegalTerm[] => {
  return legalGlossary.filter(term => term.category === category);
};

// Função para detectar termos legais em um texto
export const detectLegalTerms = (text: string): string[] => {
  const words = text.toLowerCase().split(/\s+/);
  const foundTerms: string[] = [];
  
  legalGlossary.forEach(term => {
    // Verifica termo principal
    if (text.toLowerCase().includes(term.term.toLowerCase())) {
      foundTerms.push(term.term);
    }
    
    // Verifica termos relacionados
    term.relatedTerms?.forEach(related => {
      if (text.toLowerCase().includes(related.toLowerCase())) {
        foundTerms.push(related);
      }
    });
  });
  
  return [...new Set(foundTerms)]; // Remove duplicatas
};

// Categorias com labels em português
export const categoryLabels: Record<LegalTerm['category'], string> = {
  'civil': 'Direito Civil',
  'penal': 'Direito Penal',
  'trabalho': 'Direito do Trabalho',
  'comercial': 'Direito Comercial',
  'constitucional': 'Direito Constitucional',
  'processual': 'Direito Processual',
  'familiar': 'Direito da Família'
};