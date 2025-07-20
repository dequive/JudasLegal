"""
Sistema de Orquestração de LLMs para Muzaia Legal Assistant
Integra múltiplos provedores de IA com fallback automático
"""

from enum import Enum
from typing import Optional, Dict, Any, List
from abc import ABC, abstractmethod
import asyncio
import time
import logging
from datetime import datetime
import numpy as np

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMProvider(Enum):
    """Enum dos provedores de LLM disponíveis"""
    OPENAI_GPT4 = "openai_gpt4"
    CLAUDE_3_SONNET = "claude_3_sonnet"
    CLAUDE_3_HAIKU = "claude_3_haiku"
    CLAUDE_3_OPUS = "claude_3_opus"
    GEMINI_2_FLASH = "gemini_2_flash"

class BaseLLMProvider(ABC):
    """Classe base abstrata para todos os provedores de LLM"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.max_retries = 3
        self.timeout = 30
        
    @abstractmethod
    async def generate_response(self, prompt: str, context: str = "") -> str:
        """Gera resposta usando o provedor específico"""
        pass
    
    @abstractmethod
    def is_available(self) -> bool:
        """Verifica se o provedor está disponível"""
        pass
    
    @abstractmethod
    def get_model_info(self) -> Dict[str, Any]:
        """Retorna informações sobre o modelo"""
        pass

class ClaudeProvider(BaseLLMProvider):
    """Provedor para modelos Claude 3 da Anthropic"""
    
    def __init__(self, api_key: str, model_version: str = "claude-3-sonnet-20240229"):
        super().__init__(api_key)
        self.model_version = model_version
        self.max_tokens = 4000
        
        try:
            import anthropic
            self.client = anthropic.Anthropic(api_key=api_key)
        except ImportError:
            logger.error("Biblioteca anthropic não instalada. Execute: pip install anthropic")
            self.client = None
        except Exception as e:
            logger.error(f"Erro ao inicializar Claude: {e}")
            self.client = None
    
    async def generate_response(self, prompt: str, context: str = "") -> str:
        """Gera resposta usando Claude 3"""
        if not self.client:
            raise Exception("Cliente Claude não inicializado")
            
        try:
            # Prompt otimizado para contexto legal moçambicano
            system_prompt = self._build_legal_system_prompt(context)
            optimized_prompt = MozambiqueLegalOptimizer.optimize_prompt_for_claude(prompt, context)
            
            message = self.client.messages.create(
                model=self.model_version,
                max_tokens=self.max_tokens,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": optimized_prompt}
                ]
            )
            
            response_text = message.content[0].text
            logger.info(f"Claude resposta gerada: {len(response_text)} caracteres")
            return response_text
            
        except Exception as e:
            logger.error(f"Erro na resposta do Claude: {str(e)}")
            raise Exception(f"Erro na resposta do Claude: {str(e)}")
    
    def _build_legal_system_prompt(self, context: str) -> str:
        """Constrói prompt de sistema otimizado para direito moçambicano"""
        return f"""Você é um assistente jurídico especialista em direito moçambicano. 

Diretrizes importantes:
- Use apenas o contexto fornecido dos documentos legais para dar respostas precisas
- Sempre cite as fontes legais quando relevante com artigos específicos
- Use português europeu (vosso/vossa em vez de seu/sua)
- Forneça respostas claras e acessíveis ao público geral
- Indique quando uma questão requer consulta com advogado
- Estruture respostas com cabeçalhos e listas quando apropriado

Contexto legal: {context}

IMPORTANTE: As informações fornecidas são apenas educativas e não constituem aconselhamento jurídico formal."""
    
    def is_available(self) -> bool:
        """Verifica disponibilidade do Claude"""
        if not self.client:
            return False
            
        try:
            # Teste simples de conectividade
            response = self.client.messages.create(
                model=self.model_version,
                max_tokens=10,
                messages=[{"role": "user", "content": "teste"}]
            )
            return True
        except Exception as e:
            logger.warning(f"Claude indisponível: {e}")
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """Informações do modelo Claude"""
        return {
            "provider": "anthropic",
            "model": self.model_version,
            "max_tokens": self.max_tokens,
            "context_window": 200000,  # Claude 3 context window
            "specialties": ["análise jurídica", "texto longo", "raciocínio complexo"]
        }

class GeminiProvider(BaseLLMProvider):
    """Provedor para Google Gemini (já existente, adaptar interface)"""
    
    def __init__(self, api_key: str, model_version: str = "gemini-2.0-flash"):
        super().__init__(api_key)
        self.model_version = model_version
        
        try:
            from google.generativeai import GenerativeModel, configure
            configure(api_key=api_key)
            self.model = GenerativeModel(model_version)
        except ImportError:
            logger.error("Biblioteca google-generativeai não instalada")
            self.model = None
        except Exception as e:
            logger.error(f"Erro ao inicializar Gemini: {e}")
            self.model = None
    
    async def generate_response(self, prompt: str, context: str = "") -> str:
        """Gera resposta usando Gemini"""
        if not self.model:
            raise Exception("Cliente Gemini não inicializado")
            
        try:
            system_prompt = f"""Você é um assistente jurídico especializado em legislação moçambicana.
            
Contexto legal: {context}

Pergunta: {prompt}

Forneça uma resposta estruturada, citando fontes legais quando relevante."""
            
            response = self.model.generate_content(system_prompt)
            return response.text
            
        except Exception as e:
            logger.error(f"Erro na resposta do Gemini: {str(e)}")
            raise Exception(f"Erro na resposta do Gemini: {str(e)}")
    
    def is_available(self) -> bool:
        """Verifica disponibilidade do Gemini"""
        if not self.model:
            return False
            
        try:
            response = self.model.generate_content("teste")
            return True
        except Exception:
            return False
    
    def get_model_info(self) -> Dict[str, Any]:
        """Informações do modelo Gemini"""
        return {
            "provider": "google",
            "model": self.model_version,
            "max_tokens": 8192,
            "context_window": 32768,
            "specialties": ["multimodal", "velocidade", "custo-efetivo"]
        }

class LLMOrchestrator:
    """Orquestrador principal que gerencia múltiplos provedores de LLM"""
    
    def __init__(self):
        self.providers: Dict[LLMProvider, BaseLLMProvider] = {}
        self.fallback_order = [
            LLMProvider.CLAUDE_3_SONNET,
            LLMProvider.GEMINI_2_FLASH,
            LLMProvider.CLAUDE_3_HAIKU
        ]
        self.metrics = LLMMetrics()
        
    def add_provider(self, provider_type: LLMProvider, provider: BaseLLMProvider):
        """Adiciona um provedor ao orquestrador"""
        self.providers[provider_type] = provider
        logger.info(f"Provedor {provider_type.value} adicionado")
        
    def set_fallback_order(self, order: List[LLMProvider]):
        """Define ordem de fallback personalizada"""
        self.fallback_order = order
        logger.info(f"Ordem de fallback atualizada: {[p.value for p in order]}")
        
    async def get_legal_response(self, query: str, retrieved_context: str) -> Dict[str, Any]:
        """
        Obtém resposta legal usando ordem de fallback
        """
        start_time = time.time()
        
        for provider_type in self.fallback_order:
            if provider_type not in self.providers:
                continue
                
            provider = self.providers[provider_type]
            
            if not provider.is_available():
                logger.warning(f"Provedor {provider_type.value} indisponível")
                continue
                
            try:
                logger.info(f"Tentando resposta com {provider_type.value}")
                
                response = await provider.generate_response(query, retrieved_context)
                response_time = time.time() - start_time
                
                # Registrar métricas
                self.metrics.track_request(provider_type.value, response_time)
                
                return {
                    "response": response,
                    "provider": provider_type.value,
                    "response_time": response_time,
                    "success": True,
                    "model_info": provider.get_model_info()
                }
                
            except Exception as e:
                logger.error(f"Falhou com {provider_type.value}: {str(e)}")
                self.metrics.track_failure(provider_type.value, str(e))
                continue
        
        # Fallback final
        self.metrics.track_fallback_activation()
        return {
            "response": "Desculpe, todos os serviços de IA estão temporariamente indisponíveis. Por favor, tente novamente em alguns minutos.",
            "provider": "fallback",
            "response_time": time.time() - start_time,
            "success": False,
            "error": "Todos os provedores falharam"
        }
    
    def get_available_providers(self) -> List[str]:
        """Lista provedores disponíveis no momento"""
        available = []
        for provider_type, provider in self.providers.items():
            if provider.is_available():
                available.append(provider_type.value)
        return available
    
    def get_health_status(self) -> Dict[str, Any]:
        """Status de saúde do orquestrador"""
        status = {
            "providers": {},
            "fallback_order": [p.value for p in self.fallback_order],
            "metrics": self.metrics.get_performance_summary()
        }
        
        for provider_type, provider in self.providers.items():
            status["providers"][provider_type.value] = {
                "available": provider.is_available(),
                "model_info": provider.get_model_info()
            }
            
        return status

class MozambiqueLegalOptimizer:
    """Otimizador de prompts específico para direito moçambicano"""
    
    @staticmethod
    def optimize_prompt_for_claude(query: str, context: str) -> str:
        """Otimiza prompts para melhor desempenho em questões legais moçambicanas"""
        
        legal_prefixes = {
            "constituição": "Questão sobre direitos fundamentais e constitucionalidade",
            "trabalho": "Questão sobre direito laboral e condições de trabalho",
            "família": "Questão sobre direito de família, casamento e divórcio",
            "penal": "Questão sobre direito penal e crimes",
            "civil": "Questão sobre direito civil, contratos e obrigações",
            "comercial": "Questão sobre direito comercial e empresarial",
            "administrativo": "Questão sobre direito administrativo e procedimentos"
        }
        
        # Detectar tipo de questão legal
        query_lower = query.lower()
        legal_type = "questão jurídica geral"
        
        for keyword, description in legal_prefixes.items():
            if keyword in query_lower:
                legal_type = description
                break
        
        optimized_prompt = f"""
[{legal_type}] - Direito Moçambicano

Pergunta do utilizador: {query}

Instruções específicas para vossa resposta:
- Cite sempre os artigos específicos da legislação moçambicana relevante
- Use linguagem clara e acessível ao público em geral
- Forneça exemplos práticos quando relevante
- Indique se há procedimentos específicos a seguir
- Estruture a resposta com cabeçalhos claros
- Mencione se a questão requer consulta com advogado qualificado
- Use português europeu (vosso/vossa)

Se não há informação suficiente no contexto, indique claramente essa limitação.
        """
        
        return optimized_prompt.strip()

class LLMMetrics:
    """Sistema de métricas e monitoramento para LLMs"""
    
    def __init__(self):
        self.usage_stats = {
            "claude_3_sonnet_requests": 0,
            "claude_3_haiku_requests": 0,
            "gemini_2_flash_requests": 0,
            "fallback_activations": 0,
            "total_failures": 0,
            "response_times": [],
            "failures": []
        }
    
    def track_request(self, provider: str, response_time: float):
        """Registra uma requisição bem-sucedida"""
        self.usage_stats[f"{provider}_requests"] += 1
        self.usage_stats["response_times"].append({
            "provider": provider,
            "time": response_time,
            "timestamp": datetime.now()
        })
        
    def track_failure(self, provider: str, error: str):
        """Registra uma falha"""
        self.usage_stats["total_failures"] += 1
        self.usage_stats["failures"].append({
            "provider": provider,
            "error": error,
            "timestamp": datetime.now()
        })
        
    def track_fallback_activation(self):
        """Registra ativação do fallback"""
        self.usage_stats["fallback_activations"] += 1
        
    def get_performance_summary(self) -> Dict[str, Any]:
        """Sumário de performance"""
        total_requests = sum([v for k, v in self.usage_stats.items() if "_requests" in k])
        
        avg_response_time = 0
        if self.usage_stats["response_times"]:
            avg_response_time = np.mean([r["time"] for r in self.usage_stats["response_times"]])
        
        return {
            "total_requests": total_requests,
            "total_failures": self.usage_stats["total_failures"],
            "fallback_activations": self.usage_stats["fallback_activations"],
            "avg_response_time": round(avg_response_time, 2),
            "success_rate": round((total_requests - self.usage_stats["total_failures"]) / max(total_requests, 1) * 100, 2),
            "provider_distribution": {
                k: v for k, v in self.usage_stats.items() if "_requests" in k
            }
        }