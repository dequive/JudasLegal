"""
Sistema de Hierarquia de Documentos Legais Moçambicanos - Fase 3
Implementa a estrutura completa da hierarquia legal moçambicana
"""
from enum import IntEnum
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

class LegalDocumentType(IntEnum):
    """Tipos de documentos legais em ordem hierárquica"""
    CONSTITUICAO = 1
    LEI = 2
    DECRETO_LEI = 3
    DECRETO = 4
    REGULAMENTO = 5
    PORTARIA = 6
    DIPLOMA_MINISTERIAL = 7
    INSTRUCAO = 8
    CIRCULAR = 9
    DESPACHO = 10

class LegalArea(IntEnum):
    """Áreas do direito moçambicano"""
    CONSTITUCIONAL = 1
    CIVIL = 2
    PENAL = 3
    COMERCIAL = 4
    TRABALHO = 5
    ADMINISTRATIVO = 6
    FISCAL = 7
    FUNDIARIO = 8
    AMBIENTAL = 9
    FAMILIA = 10
    PROCESSO_CIVIL = 11
    PROCESSO_PENAL = 12
    SEGURANCA_SOCIAL = 13
    IMIGRACAO = 14
    PROPRIEDADE_INTELECTUAL = 15

@dataclass
class LegalConcept:
    """Conceito jurídico com definição e contexto"""
    name: str
    definition: str
    area: LegalArea
    complexity_level: int  # 1-4
    related_concepts: List[str]
    examples: List[str]
    legal_basis: Optional[str] = None

@dataclass
class DocumentMetadata:
    """Metadados completos de um documento legal"""
    title: str
    document_type: LegalDocumentType
    legal_area: LegalArea
    publication_date: Optional[datetime]
    effective_date: Optional[datetime]
    status: str  # "active", "revoked", "amended"
    source: str
    keywords: List[str]
    description: str
    hierarchical_level: int
    authority_weight: float
    related_documents: List[int] = None

class LegalDocumentHierarchy:
    """Sistema de hierarquia legal moçambicana"""
    
    DOCUMENT_TYPES = {
        LegalDocumentType.CONSTITUICAO: "Constituição da República",
        LegalDocumentType.LEI: "Lei",
        LegalDocumentType.DECRETO_LEI: "Decreto-Lei",
        LegalDocumentType.DECRETO: "Decreto",
        LegalDocumentType.REGULAMENTO: "Regulamento",
        LegalDocumentType.PORTARIA: "Portaria",
        LegalDocumentType.DIPLOMA_MINISTERIAL: "Diploma Ministerial",
        LegalDocumentType.INSTRUCAO: "Instrução",
        LegalDocumentType.CIRCULAR: "Circular",
        LegalDocumentType.DESPACHO: "Despacho"
    }
    
    LEGAL_AREAS = {
        LegalArea.CONSTITUCIONAL: "Direito Constitucional",
        LegalArea.CIVIL: "Direito Civil",
        LegalArea.PENAL: "Direito Penal",
        LegalArea.COMERCIAL: "Direito Comercial",
        LegalArea.TRABALHO: "Direito do Trabalho",
        LegalArea.ADMINISTRATIVO: "Direito Administrativo",
        LegalArea.FISCAL: "Direito Fiscal",
        LegalArea.FUNDIARIO: "Direito Fundiário",
        LegalArea.AMBIENTAL: "Direito Ambiental",
        LegalArea.FAMILIA: "Direito da Família",
        LegalArea.PROCESSO_CIVIL: "Processo Civil",
        LegalArea.PROCESSO_PENAL: "Processo Penal",
        LegalArea.SEGURANCA_SOCIAL: "Segurança Social",
        LegalArea.IMIGRACAO: "Imigração",
        LegalArea.PROPRIEDADE_INTELECTUAL: "Propriedade Intelectual"
    }
    
    # Pesos hierárquicos para cálculo de autoridade
    AUTHORITY_WEIGHTS = {
        LegalDocumentType.CONSTITUICAO: 1.0,
        LegalDocumentType.LEI: 0.9,
        LegalDocumentType.DECRETO_LEI: 0.8,
        LegalDocumentType.DECRETO: 0.7,
        LegalDocumentType.REGULAMENTO: 0.6,
        LegalDocumentType.PORTARIA: 0.5,
        LegalDocumentType.DIPLOMA_MINISTERIAL: 0.4,
        LegalDocumentType.INSTRUCAO: 0.3,
        LegalDocumentType.CIRCULAR: 0.2,
        LegalDocumentType.DESPACHO: 0.1
    }
    
    # Documentos prioritários para adicionar à base
    PRIORITY_DOCUMENTS = [
        {
            "title": "Código Comercial de Moçambique",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.COMERCIAL,
            "priority": 1,
            "description": "Legislação fundamental para actividades comerciais"
        },
        {
            "title": "Lei de Terras",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.FUNDIARIO,
            "priority": 1,
            "description": "Lei principal sobre propriedade e uso da terra"
        },
        {
            "title": "Lei do Ambiente",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.AMBIENTAL,
            "priority": 2,
            "description": "Legislação ambiental e conservação"
        },
        {
            "title": "Código de Processo Civil",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.PROCESSO_CIVIL,
            "priority": 1,
            "description": "Procedimentos para processos civis"
        },
        {
            "title": "Código de Processo Penal",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.PROCESSO_PENAL,
            "priority": 1,
            "description": "Procedimentos para processos penais"
        },
        {
            "title": "Lei de Segurança Social",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.SEGURANCA_SOCIAL,
            "priority": 2,
            "description": "Sistema de segurança social moçambicano"
        },
        {
            "title": "Código Fiscal",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.FISCAL,
            "priority": 1,
            "description": "Legislação tributária e fiscal"
        },
        {
            "title": "Lei de Imigração",
            "type": LegalDocumentType.LEI,
            "area": LegalArea.IMIGRACAO,
            "priority": 2,
            "description": "Regulamentação de entrada e permanência de estrangeiros"
        }
    ]
    
    # Conceitos jurídicos por área
    LEGAL_CONCEPTS = {
        LegalArea.CONSTITUCIONAL: [
            LegalConcept(
                name="Direitos Fundamentais",
                definition="Direitos básicos e essenciais garantidos constitucionalmente a todos os cidadãos",
                area=LegalArea.CONSTITUCIONAL,
                complexity_level=2,
                related_concepts=["liberdades", "garantias", "dignidade humana"],
                examples=["direito à vida", "liberdade de expressão", "direito à educação"],
                legal_basis="Constituição da República, Artigos 35-95"
            ),
            LegalConcept(
                name="Separação de Poderes",
                definition="Divisão das funções do Estado em três poderes independentes: Executivo, Legislativo e Judicial",
                area=LegalArea.CONSTITUCIONAL,
                complexity_level=3,
                related_concepts=["executivo", "legislativo", "judicial", "checks and balances"],
                examples=["Presidente da República", "Assembleia da República", "Tribunais"],
                legal_basis="Constituição da República, Artigos 106-244"
            )
        ],
        LegalArea.CIVIL: [
            LegalConcept(
                name="Personalidade Jurídica",
                definition="Capacidade de ser titular de direitos e obrigações na ordem jurídica",
                area=LegalArea.CIVIL,
                complexity_level=2,
                related_concepts=["capacidade", "direitos", "obrigações"],
                examples=["pessoas singulares", "pessoas colectivas"],
                legal_basis="Código Civil, Artigos 66-78"
            ),
            LegalConcept(
                name="Responsabilidade Civil",
                definition="Obrigação de reparar danos causados a outrem por facto próprio ou de terceiros",
                area=LegalArea.CIVIL,
                complexity_level=3,
                related_concepts=["culpa", "dolo", "nexo causal", "indemnização"],
                examples=["acidente de viação", "danos morais", "responsabilidade médica"],
                legal_basis="Código Civil, Artigos 483-510"
            )
        ],
        LegalArea.PENAL: [
            LegalConcept(
                name="Dolo",
                definition="Vontade consciente de praticar um facto típico e ilícito",
                area=LegalArea.PENAL,
                complexity_level=3,
                related_concepts=["culpa", "negligência", "intenção"],
                examples=["dolo directo", "dolo eventual"],
                legal_basis="Código Penal, Artigo 13"
            ),
            LegalConcept(
                name="Legítima Defesa",
                definition="Direito de repelir uma agressão actual e ilícita usando meios necessários",
                area=LegalArea.PENAL,
                complexity_level=2,
                related_concepts=["agressão", "proporcionalidade", "necessidade"],
                examples=["defesa pessoal", "defesa de terceiros", "defesa de propriedade"],
                legal_basis="Código Penal, Artigo 32"
            )
        ],
        LegalArea.TRABALHO: [
            LegalConcept(
                name="Contrato de Trabalho",
                definition="Acordo pelo qual uma pessoa se obriga a prestar actividade a outra sob direcção desta",
                area=LegalArea.TRABALHO,
                complexity_level=2,
                related_concepts=["subordinação", "remuneração", "horário"],
                examples=["contrato sem termo", "contrato a termo", "trabalho temporário"],
                legal_basis="Lei do Trabalho, Artigos 10-25"
            ),
            LegalConcept(
                name="Despedimento",
                definition="Cessação unilateral do contrato de trabalho por iniciativa do empregador",
                area=LegalArea.TRABALHO,
                complexity_level=3,
                related_concepts=["justa causa", "indemnização", "pré-aviso"],
                examples=["despedimento disciplinar", "despedimento colectivo"],
                legal_basis="Lei do Trabalho, Artigos 80-95"
            )
        ]
    }
    
    @classmethod
    def get_type_name(cls, doc_type: LegalDocumentType) -> str:
        """Retorna o nome do tipo de documento"""
        return cls.DOCUMENT_TYPES.get(doc_type, "Desconhecido")
    
    @classmethod
    def get_area_name(cls, area: LegalArea) -> str:
        """Retorna o nome da área legal"""
        return cls.LEGAL_AREAS.get(area, "Desconhecido")
    
    @classmethod
    def get_authority_weight(cls, doc_type: LegalDocumentType) -> float:
        """Retorna o peso de autoridade do tipo de documento"""
        return cls.AUTHORITY_WEIGHTS.get(doc_type, 0.5)
    
    @classmethod
    def get_concepts_by_area(cls, area: LegalArea) -> List[LegalConcept]:
        """Retorna conceitos jurídicos de uma área específica"""
        return cls.LEGAL_CONCEPTS.get(area, [])
    
    @classmethod
    def detect_document_type(cls, title: str, content: str) -> LegalDocumentType:
        """Detecta o tipo de documento baseado no título e conteúdo"""
        title_lower = title.lower()
        content_lower = content.lower()
        
        if "constituição" in title_lower:
            return LegalDocumentType.CONSTITUICAO
        elif "decreto-lei" in title_lower or "decreto lei" in title_lower:
            return LegalDocumentType.DECRETO_LEI
        elif "decreto" in title_lower:
            return LegalDocumentType.DECRETO
        elif "lei" in title_lower:
            return LegalDocumentType.LEI
        elif "regulamento" in title_lower:
            return LegalDocumentType.REGULAMENTO
        elif "portaria" in title_lower:
            return LegalDocumentType.PORTARIA
        elif "diploma" in title_lower:
            return LegalDocumentType.DIPLOMA_MINISTERIAL
        elif "instrução" in title_lower or "instrucao" in title_lower:
            return LegalDocumentType.INSTRUCAO
        elif "circular" in title_lower:
            return LegalDocumentType.CIRCULAR
        elif "despacho" in title_lower:
            return LegalDocumentType.DESPACHO
        else:
            return LegalDocumentType.LEI  # Default
    
    @classmethod
    def detect_legal_area(cls, title: str, content: str) -> LegalArea:
        """Detecta a área legal baseado no título e conteúdo"""
        text = (title + " " + content).lower()
        
        area_keywords = {
            LegalArea.CONSTITUCIONAL: ["constituição", "direitos fundamentais", "estado", "poderes"],
            LegalArea.CIVIL: ["civil", "contrato", "propriedade", "obrigação", "responsabilidade"],
            LegalArea.PENAL: ["penal", "crime", "pena", "prisão", "delito"],
            LegalArea.COMERCIAL: ["comercial", "empresa", "sociedade", "negócio", "actividade empresarial"],
            LegalArea.TRABALHO: ["trabalho", "trabalhador", "empregador", "salário", "emprego"],
            LegalArea.ADMINISTRATIVO: ["administrativo", "administração pública", "funcionário público"],
            LegalArea.FISCAL: ["fiscal", "imposto", "taxa", "tributação", "receita"],
            LegalArea.FUNDIARIO: ["terra", "fundiário", "propriedade fundiária", "uso da terra"],
            LegalArea.AMBIENTAL: ["ambiente", "ambiental", "conservação", "poluição"],
            LegalArea.FAMILIA: ["família", "casamento", "divórcio", "filhos", "adopção"],
            LegalArea.PROCESSO_CIVIL: ["processo civil", "acção", "recurso", "tribunal civil"],
            LegalArea.PROCESSO_PENAL: ["processo penal", "acusação", "julgamento", "tribunal penal"],
            LegalArea.SEGURANCA_SOCIAL: ["segurança social", "pensão", "reforma", "subsídio"],
            LegalArea.IMIGRACAO: ["imigração", "visto", "residência", "nacionalidade"],
            LegalArea.PROPRIEDADE_INTELECTUAL: ["propriedade intelectual", "marca", "patente", "direitos autorais"]
        }
        
        best_area = LegalArea.CIVIL  # Default
        max_matches = 0
        
        for area, keywords in area_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in text)
            if matches > max_matches:
                max_matches = matches
                best_area = area
        
        return best_area
    
    @classmethod
    def extract_keywords(cls, title: str, content: str, legal_area: LegalArea) -> List[str]:
        """Extrai palavras-chave relevantes do documento"""
        text = (title + " " + content).lower()
        
        # Keywords gerais jurídicas
        general_keywords = [
            "artigo", "lei", "decreto", "regulamento", "direito", "dever", "obrigação",
            "responsabilidade", "processo", "tribunal", "sentença", "recurso", "multa",
            "pena", "sanção", "indemnização", "compensação", "prazo", "procedimento"
        ]
        
        # Keywords específicas por área
        area_specific = {
            LegalArea.COMERCIAL: ["empresa", "sociedade", "contrato comercial", "actividade económica"],
            LegalArea.TRABALHO: ["contrato trabalho", "despedimento", "férias", "horário"],
            LegalArea.CIVIL: ["propriedade", "usufruito", "herança", "sucessão"],
            LegalArea.PENAL: ["crime", "delito", "prisão", "liberdade condicional"],
            LegalArea.FISCAL: ["imposto", "iva", "irps", "declaração fiscal"]
        }
        
        keywords = []
        
        # Adicionar keywords encontradas
        for keyword in general_keywords:
            if keyword in text:
                keywords.append(keyword)
        
        # Adicionar keywords específicas da área
        if legal_area in area_specific:
            for keyword in area_specific[legal_area]:
                if keyword in text:
                    keywords.append(keyword)
        
        return list(set(keywords))  # Remover duplicados
    
    @classmethod
    def create_document_metadata(
        cls, 
        title: str, 
        content: str, 
        override_data: Dict[str, Any] = None
    ) -> DocumentMetadata:
        """Cria metadados completos para um documento"""
        
        # Detectar automaticamente se não fornecido
        doc_type = override_data.get('document_type') if override_data else None
        if doc_type is None:
            doc_type = cls.detect_document_type(title, content)
        elif isinstance(doc_type, int):
            doc_type = LegalDocumentType(doc_type)
        
        legal_area = override_data.get('legal_area') if override_data else None
        if legal_area is None:
            legal_area = cls.detect_legal_area(title, content)
        elif isinstance(legal_area, int):
            legal_area = LegalArea(legal_area)
        
        keywords = cls.extract_keywords(title, content, legal_area)
        
        return DocumentMetadata(
            title=title,
            document_type=doc_type,
            legal_area=legal_area,
            publication_date=override_data.get('publication_date') if override_data else None,
            effective_date=override_data.get('effective_date') if override_data else None,
            status=override_data.get('status', 'active') if override_data else 'active',
            source=override_data.get('source', 'Sistema Muzaia') if override_data else 'Sistema Muzaia',
            keywords=keywords,
            description=override_data.get('description', '') if override_data else '',
            hierarchical_level=doc_type.value,
            authority_weight=cls.get_authority_weight(doc_type),
            related_documents=override_data.get('related_documents', []) if override_data else []
        )