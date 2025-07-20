// Legal Glossary for Mozambican Law
// Comprehensive database of legal terms with contextual explanations

export const legalGlossary = [
  // Constitutional Law
  {
    term: "constituição",
    definition: "Lei fundamental do Estado que estabelece a organização política, os direitos e deveres dos cidadãos",
    category: "Direito Constitucional",
    example: "A Constituição da República de Moçambique foi aprovada em 2004",
    relatedTerms: ["lei fundamental", "estado de direito", "soberania"],
    complexity: "moderate"
  },
  {
    term: "estado de direito",
    definition: "Princípio segundo o qual o poder do Estado está limitado pela lei e pelos direitos fundamentais",
    category: "Direito Constitucional",
    example: "O estado de direito garante que ninguém está acima da lei",
    relatedTerms: ["constituição", "legalidade", "separação de poderes"],
    complexity: "complex"
  },
  {
    term: "soberania",
    definition: "Poder supremo do Estado sobre o seu território e população",
    category: "Direito Constitucional",
    example: "A soberania nacional reside no povo moçambicano",
    relatedTerms: ["independência", "autodeterminação", "territorialidade"],
    complexity: "complex"
  },

  // Civil Law
  {
    term: "código civil",
    definition: "Conjunto de normas que regulam as relações jurídicas entre particulares",
    category: "Direito Civil",
    example: "O Código Civil regula contratos, propriedade e responsabilidade civil",
    relatedTerms: ["direito privado", "relações jurídicas", "personalidade jurídica"],
    complexity: "moderate"
  },
  {
    term: "personalidade jurídica",
    definition: "Capacidade de ser titular de direitos e obrigações na ordem jurídica",
    category: "Direito Civil",
    example: "A personalidade jurídica adquire-se no momento do nascimento",
    relatedTerms: ["capacidade jurídica", "pessoa singular", "pessoa colectiva"],
    complexity: "complex"
  },
  {
    term: "usucapião",
    definition: "Modo de adquirir a propriedade pela posse prolongada no tempo",
    category: "Direito Civil",
    example: "A usucapião permite adquirir propriedade após 20 anos de posse pacífica",
    relatedTerms: ["posse", "propriedade", "prescrição aquisitiva"],
    complexity: "complex"
  },
  {
    term: "responsabilidade civil",
    definition: "Obrigação de reparar danos causados a outrem por acto ilícito",
    category: "Direito Civil",
    example: "A responsabilidade civil obriga à indemnização por danos morais e materiais",
    relatedTerms: ["danos", "culpa", "indemnização"],
    complexity: "moderate"
  },

  // Criminal Law
  {
    term: "código penal",
    definition: "Lei que define os crimes e estabelece as respectivas penas",
    category: "Direito Penal",
    example: "O Código Penal criminaliza o furto, roubo e outros delitos",
    relatedTerms: ["crime", "pena", "sanção penal"],
    complexity: "moderate"
  },
  {
    term: "presunção de inocência",
    definition: "Princípio que considera toda a pessoa inocente até prova em contrário",
    category: "Direito Penal",
    example: "A presunção de inocência é um direito fundamental do arguido",
    relatedTerms: ["devido processo legal", "ónus da prova", "in dubio pro reo"],
    complexity: "complex"
  },
  {
    term: "habeas corpus",
    definition: "Garantia constitucional contra prisão ilegal ou abusiva",
    category: "Direito Penal",
    example: "O habeas corpus protege a liberdade individual contra detenções ilegais",
    relatedTerms: ["liberdade", "prisão preventiva", "garantias fundamentais"],
    complexity: "complex"
  },

  // Commercial Law
  {
    term: "código comercial",
    definition: "Lei que regula as actividades comerciais e empresariais",
    category: "Direito Comercial",
    example: "O Código Comercial define as regras para sociedades comerciais",
    relatedTerms: ["actividade comercial", "sociedades", "registo comercial"],
    complexity: "moderate"
  },
  {
    term: "sociedade anónima",
    definition: "Tipo de sociedade comercial cujo capital está dividido em acções",
    category: "Direito Comercial",
    example: "Uma sociedade anónima permite a participação de múltiplos accionistas",
    relatedTerms: ["acções", "capital social", "responsabilidade limitada"],
    complexity: "complex"
  },

  // Labor Law
  {
    term: "contrato de trabalho",
    definition: "Acordo pelo qual uma pessoa se obriga a prestar trabalho sob autoridade de outrem",
    category: "Direito do Trabalho",
    example: "O contrato de trabalho estabelece direitos e deveres do trabalhador e empregador",
    relatedTerms: ["relação laboral", "subordinação jurídica", "salário"],
    complexity: "simple"
  },
  {
    term: "despedimento",
    definition: "Cessação do contrato de trabalho por iniciativa do empregador",
    category: "Direito do Trabalho",
    example: "O despedimento sem justa causa dá direito a indemnização",
    relatedTerms: ["justa causa", "indemnização", "aviso prévio"],
    complexity: "moderate"
  },

  // Procedural Law
  {
    term: "jurisdição",
    definition: "Poder de julgar e aplicar o direito aos casos concretos",
    category: "Direito Processual",
    example: "Os tribunais exercem jurisdição sobre o território nacional",
    relatedTerms: ["competência", "poder judicial", "tribunais"],
    complexity: "complex"
  },
  {
    term: "competência",
    definition: "Medida da jurisdição de cada tribunal para conhecer determinadas causas",
    category: "Direito Processual",
    example: "A competência territorial determina qual tribunal deve julgar o caso",
    relatedTerms: ["jurisdição", "foro competente", "conexão"],
    complexity: "complex"
  },
  {
    term: "recurso",
    definition: "Meio processual para impugnar decisões judiciais",
    category: "Direito Processual",
    example: "O recurso de apelação permite contestar sentenças de primeira instância",
    relatedTerms: ["apelação", "revista", "instância superior"],
    complexity: "moderate"
  },
  {
    term: "acórdão",
    definition: "Decisão judicial proferida por tribunal colectivo",
    category: "Direito Processual",
    example: "O acórdão do Tribunal da Relação confirmou a sentença de primeira instância",
    relatedTerms: ["decisão judicial", "tribunal colectivo", "jurisprudência"],
    complexity: "moderate"
  },
  {
    term: "jurisprudência",
    definition: "Conjunto de decisões judiciais sobre matérias semelhantes",
    category: "Direito Processual",
    example: "A jurisprudência do Tribunal Supremo orienta os tribunais inferiores",
    relatedTerms: ["precedente", "orientação jurisprudencial", "uniformização"],
    complexity: "complex"
  },

  // Property Law
  {
    term: "propriedade",
    definition: "Direito real que confere ao titular o poder mais amplo sobre uma coisa",
    category: "Direitos Reais",
    example: "A propriedade confere os direitos de usar, fruir e dispor do bem",
    relatedTerms: ["direito real", "posse", "domínio"],
    complexity: "moderate"
  },
  {
    term: "registo predial",
    definition: "Sistema oficial de publicidade dos direitos sobre imóveis",
    category: "Direitos Reais",
    example: "O registo predial assegura a publicidade e segurança jurídica dos imóveis",
    relatedTerms: ["propriedade", "imóveis", "publicidade registral"],
    complexity: "moderate"
  },

  // Family Law
  {
    term: "casamento",
    definition: "União legalmente reconhecida entre duas pessoas",
    category: "Direito da Família",
    example: "O casamento civil celebra-se perante o conservador do registo civil",
    relatedTerms: ["união de facto", "regime de bens", "divórcio"],
    complexity: "simple"
  },
  {
    term: "poder paternal",
    definition: "Conjunto de direitos e deveres dos pais relativamente aos filhos menores",
    category: "Direito da Família",
    example: "O poder paternal inclui o dever de educação e sustento dos filhos",
    relatedTerms: ["responsabilidades parentais", "interesse do menor", "guarda"],
    complexity: "moderate"
  },

  // Succession Law
  {
    term: "sucessão",
    definition: "Transmissão dos bens e direitos de uma pessoa após a sua morte",
    category: "Direito das Sucessões",
    example: "A sucessão pode ser legítima ou testamentária",
    relatedTerms: ["herança", "herdeiro", "legítima"],
    complexity: "moderate"
  },
  {
    term: "testamento",
    definition: "Acto jurídico pelo qual uma pessoa dispõe dos seus bens para depois da morte",
    category: "Direito das Sucessões",
    example: "O testamento permite designar herdeiros e fazer doações",
    relatedTerms: ["sucessão testamentária", "legatário", "capacidade testamentária"],
    complexity: "moderate"
  },
  {
    term: "legítima",
    definition: "Porção da herança que a lei reserva aos herdeiros legitimários",
    category: "Direito das Sucessões",
    example: "A legítima protege os direitos sucessórios dos descendentes e cônjuge",
    relatedTerms: ["herdeiros legitimários", "quota disponível", "redução por inoficiosidade"],
    complexity: "complex"
  },

  // Administrative Law
  {
    term: "acto administrativo",
    definition: "Decisão unilateral da Administração Pública que produz efeitos jurídicos",
    category: "Direito Administrativo",
    example: "A licença de construção é um acto administrativo autorizativo",
    relatedTerms: ["administração pública", "discricionariedade", "impugnação"],
    complexity: "complex"
  },
  {
    term: "contencioso administrativo",
    definition: "Conjunto de processos judiciais contra actos da Administração Pública",
    category: "Direito Administrativo",
    example: "O contencioso administrativo permite impugnar decisões administrativas ilegais",
    relatedTerms: ["tribunais administrativos", "acto administrativo", "anulação"],
    complexity: "complex"
  }
];

// Category colors for visual organization
export const categoryColors = {
  "Direito Constitucional": "#8b5cf6",
  "Direito Civil": "#3b82f6", 
  "Direito Penal": "#ef4444",
  "Direito Comercial": "#f59e0b",
  "Direito do Trabalho": "#10b981",
  "Direito Processual": "#6366f1",
  "Direitos Reais": "#84cc16",
  "Direito da Família": "#ec4899",
  "Direito das Sucessões": "#f97316",
  "Direito Administrativo": "#06b6d4"
};

// Complexity levels
export const complexityLevels = {
  simple: { label: "Básico", color: "#10b981", icon: "📖" },
  moderate: { label: "Intermediário", color: "#f59e0b", icon: "⚖️" },
  complex: { label: "Avançado", color: "#ef4444", icon: "🎓" }
};