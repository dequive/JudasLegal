#!/usr/bin/env python3
"""
Muzaia - Sistema de Hierarquia de Documentos Legais
Estrutura hierárquica para legislação moçambicana
"""

from enum import IntEnum
from typing import List, Dict, Any, Optional
from datetime import datetime
import json

class LegalDocumentType(IntEnum):
    """Hierarquia de documentos legais moçambicanos"""
    CONSTITUICAO = 1
    LEI_ORDINARIA = 2
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
    LABORAL = 5
    ADMINISTRATIVO = 6
    FISCAL = 7
    FUNDIARIO = 8
    AMBIENTAL = 9
    FAMILIA = 10
    PROCESSUAL_CIVIL = 11
    PROCESSUAL_PENAL = 12
    SEGURANCA_SOCIAL = 13
    IMIGRACAO = 14
    PROPRIEDADE_INTELECTUAL = 15

class DocumentStatus(IntEnum):
    """Status de vigência do documento"""
    ACTIVO = 1
    REVOGADO = 2
    SUSPENSO = 3
    EM_REVISAO = 4
    PROJECTO = 5

class LegalDocumentMetadata:
    """Metadados estruturados para documentos legais"""
    
    def __init__(
        self,
        document_type: LegalDocumentType,
        legal_area: LegalArea,
        publication_date: datetime,
        effective_date: Optional[datetime] = None,
        status: DocumentStatus = DocumentStatus.ACTIVO,
        hierarchy_level: Optional[int] = None,
        parent_document_id: Optional[int] = None,
        keywords: Optional[List[str]] = None,
        cross_references: Optional[List[int]] = None
    ):
        self.document_type = document_type
        self.legal_area = legal_area
        self.publication_date = publication_date
        self.effective_date = effective_date or publication_date
        self.status = status
        self.hierarchy_level = hierarchy_level or document_type.value
        self.parent_document_id = parent_document_id
        self.keywords = keywords or []
        self.cross_references = cross_references or []
        
    def to_dict(self) -> Dict[str, Any]:
        """Converter metadados para dicionário"""
        return {
            'document_type': self.document_type.value,
            'legal_area': self.legal_area.value,
            'publication_date': self.publication_date.isoformat(),
            'effective_date': self.effective_date.isoformat(),
            'status': self.status.value,
            'hierarchy_level': self.hierarchy_level,
            'parent_document_id': self.parent_document_id,
            'keywords': self.keywords,
            'cross_references': self.cross_references
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'LegalDocumentMetadata':
        """Criar metadados a partir de dicionário"""
        return cls(
            document_type=LegalDocumentType(data['document_type']),
            legal_area=LegalArea(data['legal_area']),
            publication_date=datetime.fromisoformat(data['publication_date']),
            effective_date=datetime.fromisoformat(data['effective_date']),
            status=DocumentStatus(data['status']),
            hierarchy_level=data.get('hierarchy_level'),
            parent_document_id=data.get('parent_document_id'),
            keywords=data.get('keywords', []),
            cross_references=data.get('cross_references', [])
        )

class LegalDocumentHierarchy:
    """Sistema de hierarquia e gestão de documentos legais"""
    
    TYPE_NAMES = {
        LegalDocumentType.CONSTITUICAO: "Constituição da República",
        LegalDocumentType.LEI_ORDINARIA: "Lei",
        LegalDocumentType.DECRETO_LEI: "Decreto-Lei",
        LegalDocumentType.DECRETO: "Decreto",
        LegalDocumentType.REGULAMENTO: "Regulamento",
        LegalDocumentType.PORTARIA: "Portaria",
        LegalDocumentType.DIPLOMA_MINISTERIAL: "Diploma Ministerial",
        LegalDocumentType.INSTRUCAO: "Instrução",
        LegalDocumentType.CIRCULAR: "Circular",
        LegalDocumentType.DESPACHO: "Despacho"
    }
    
    AREA_NAMES = {
        LegalArea.CONSTITUCIONAL: "Direito Constitucional",
        LegalArea.CIVIL: "Direito Civil",
        LegalArea.PENAL: "Direito Penal",
        LegalArea.COMERCIAL: "Direito Comercial",
        LegalArea.LABORAL: "Direito do Trabalho",
        LegalArea.ADMINISTRATIVO: "Direito Administrativo",
        LegalArea.FISCAL: "Direito Fiscal",
        LegalArea.FUNDIARIO: "Direito Fundiário",
        LegalArea.AMBIENTAL: "Direito Ambiental",
        LegalArea.FAMILIA: "Direito da Família",
        LegalArea.PROCESSUAL_CIVIL: "Processo Civil",
        LegalArea.PROCESSUAL_PENAL: "Processo Penal",
        LegalArea.SEGURANCA_SOCIAL: "Segurança Social",
        LegalArea.IMIGRACAO: "Imigração",
        LegalArea.PROPRIEDADE_INTELECTUAL: "Propriedade Intelectual"
    }
    
    @classmethod
    def get_type_name(cls, doc_type: LegalDocumentType) -> str:
        """Obter nome do tipo de documento"""
        return cls.TYPE_NAMES.get(doc_type, "Documento Legal")
    
    @classmethod
    def get_area_name(cls, legal_area: LegalArea) -> str:
        """Obter nome da área jurídica"""
        return cls.AREA_NAMES.get(legal_area, "Área Jurídica")
    
    @classmethod
    def get_hierarchy_weight(cls, doc_type: LegalDocumentType) -> int:
        """Obter peso hierárquico (menor = maior autoridade)"""
        return doc_type.value
    
    @classmethod
    def can_override(cls, superior_type: LegalDocumentType, inferior_type: LegalDocumentType) -> bool:
        """Verificar se um tipo de documento pode sobrepor outro"""
        return cls.get_hierarchy_weight(superior_type) < cls.get_hierarchy_weight(inferior_type)

# Documentos prioritários para adicionar
PRIORITY_DOCUMENTS = [
    {
        'title': 'Código Comercial de Moçambique',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.COMERCIAL,
        'priority': 1,
        'description': 'Legislação fundamental para actividades comerciais'
    },
    {
        'title': 'Lei de Terras',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.FUNDIARIO,
        'priority': 1,
        'description': 'Lei principal sobre propriedade e uso da terra'
    },
    {
        'title': 'Lei do Ambiente',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.AMBIENTAL,
        'priority': 2,
        'description': 'Legislação ambiental e conservação'
    },
    {
        'title': 'Código de Processo Civil',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.PROCESSUAL_CIVIL,
        'priority': 1,
        'description': 'Procedimentos para processos civis'
    },
    {
        'title': 'Código de Processo Penal',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.PROCESSUAL_PENAL,
        'priority': 1,
        'description': 'Procedimentos para processos penais'
    },
    {
        'title': 'Lei de Segurança Social',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.SEGURANCA_SOCIAL,
        'priority': 2,
        'description': 'Sistema de segurança social moçambicano'
    },
    {
        'title': 'Código Fiscal',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.FISCAL,
        'priority': 1,
        'description': 'Legislação tributária e fiscal'
    },
    {
        'title': 'Lei de Imigração',
        'type': LegalDocumentType.LEI_ORDINARIA,
        'area': LegalArea.IMIGRACAO,
        'priority': 2,
        'description': 'Regulamentação de entrada e permanência de estrangeiros'
    }
]