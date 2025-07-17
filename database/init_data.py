import asyncio
from sqlalchemy.orm import Session
from models import LegalDocument, DocumentEmbedding
from utils.text_processing import TextProcessor

async def initialize_legal_documents(db: Session):
    """
    Initialize database with sample Mozambican legal documents
    """
    try:
        # Check if documents already exist
        existing_docs = db.query(LegalDocument).count()
        if existing_docs > 0:
            print(f"Database already has {existing_docs} legal documents")
            return
        
        print("Initializing legal documents...")
        
        # Sample Mozambican legal documents
        legal_documents = [
            {
                "title": "Constituição da República de Moçambique - Direitos Fundamentais",
                "content": """
                Artigo 40 (Direito à vida)
                Todo o cidadão tem direito à vida e à integridade física e moral e não pode ser submetido a tortura ou a tratamentos cruéis, desumanos ou degradantes.

                Artigo 41 (Direito à liberdade)
                Todo o cidadão goza dos direitos, liberdades e garantias de pessoa e não pode ser privado total ou parcialmente destes direitos, salvo nos casos previstos na Constituição.

                Artigo 42 (Direito à segurança)
                Todo o cidadão tem direito à segurança e à proteção do Estado contra qualquer forma de violência, salvo nos casos previstos na lei.

                Artigo 88 (Direito ao trabalho)
                O trabalho é um direito e um dever de todos os cidadãos. Todo o cidadão tem direito ao trabalho e à livre escolha da profissão.
                """,
                "source": "Constituição da República de Moçambique de 2004",
                "law_type": "Constituição",
                "article_number": "40-42, 88"
            },
            {
                "title": "Lei do Trabalho - Idade Mínima e Condições de Trabalho",
                "content": """
                Artigo 23 (Idade mínima para admissão ao trabalho)
                A idade mínima para admissão ao trabalho é de 18 anos.

                Artigo 24 (Trabalho de menores)
                É proibido o trabalho de menores de 15 anos. Os menores de 18 anos podem trabalhar desde que:
                a) Não prejudique a sua saúde, segurança ou desenvolvimento;
                b) Não prejudique a sua educação;
                c) Seja autorizado pelos pais ou representantes legais.

                Artigo 106 (Duração normal do trabalho)
                A duração normal do trabalho não pode exceder 8 horas por dia e 48 horas por semana.

                Artigo 107 (Trabalho suplementar)
                O trabalho suplementar não pode exceder 2 horas por dia e 200 horas por ano.
                """,
                "source": "Lei nº 23/2007 - Lei do Trabalho",
                "law_type": "Lei do Trabalho",
                "article_number": "23, 24, 106, 107"
            },
            {
                "title": "Código Penal - Crimes contra o patrimônio",
                "content": """
                Artigo 385 (Furto)
                Quem, com intenção de apropriação ilegítima, subtrair coisa móvel alheia é punido com prisão de 6 meses a 3 anos.

                Artigo 386 (Furto qualificado)
                A pena é de 1 a 8 anos de prisão se:
                a) O furto for cometido por duas ou mais pessoas;
                b) O agente se introduzir em casa de habitação;
                c) O furto for cometido sobre coisa de valor consideravelmente elevado.

                Artigo 387 (Roubo)
                Quem subtrair coisa móvel alheia por meio de violência contra pessoa ou ameaça com perigo iminente para a vida ou integridade física é punido com prisão de 2 a 8 anos.
                """,
                "source": "Lei nº 35/2014 - Código Penal",
                "law_type": "Código Penal",
                "article_number": "385, 386, 387"
            },
            {
                "title": "Lei da Família - Casamento e Divórcio",
                "content": """
                Artigo 30 (Idade núbil)
                A idade núbil é de 18 anos para ambos os sexos.

                Artigo 31 (Consentimento)
                O casamento depende do consentimento livre e esclarecido dos nubentes.

                Artigo 83 (Divórcio por mútuo consentimento)
                O divórcio pode ser requerido por mútuo consentimento quando:
                a) Tenham decorrido três anos sobre a celebração do casamento;
                b) Os cônjuges declarem que a vida em comum se tornou insuportável.

                Artigo 84 (Divórcio litigioso)
                O divórcio pode ser requerido por um dos cônjuges quando se verifique ruptura definitiva da vida conjugal.
                """,
                "source": "Lei nº 10/2004 - Lei da Família",
                "law_type": "Lei da Família",
                "article_number": "30, 31, 83, 84"
            },
            {
                "title": "Código Civil - Contratos e Obrigações",
                "content": """
                Artigo 405 (Princípio da liberdade contratual)
                Dentro dos limites da lei, as partes têm a faculdade de fixar livremente o conteúdo dos contratos.

                Artigo 406 (Força obrigatória dos contratos)
                O contrato tem força obrigatória entre as partes, não podendo ser revogado senão por mútuo consentimento ou nos casos previstos na lei.

                Artigo 762 (Cumprimento das obrigações)
                O devedor cumpre a obrigação quando realiza a prestação a que está vinculado.

                Artigo 798 (Mora do devedor)
                O devedor está em mora quando não cumpre a obrigação no tempo devido.
                """,
                "source": "Lei nº 25/2019 - Código Civil",
                "law_type": "Código Civil",
                "article_number": "405, 406, 762, 798"
            }
        ]
        
        text_processor = TextProcessor()
        
        # Add documents to database
        for doc_data in legal_documents:
            # Create document
            document = LegalDocument(
                title=doc_data["title"],
                content=doc_data["content"],
                source=doc_data["source"],
                law_type=doc_data["law_type"],
                article_number=doc_data["article_number"],
                language="pt"
            )
            
            db.add(document)
            db.flush()  # Get the document ID
            
            # Create text chunks and embeddings (simplified)
            chunks = text_processor.chunk_text(doc_data["content"], chunk_size=300)
            
            for i, chunk in enumerate(chunks):
                embedding = DocumentEmbedding(
                    document_id=document.id,
                    chunk_text=chunk,
                    chunk_index=i,
                    embedding_vector=[]  # Placeholder for now
                )
                db.add(embedding)
        
        db.commit()
        print(f"Successfully initialized {len(legal_documents)} legal documents")
        
    except Exception as e:
        print(f"Error initializing legal documents: {e}")
        db.rollback()
        raise
