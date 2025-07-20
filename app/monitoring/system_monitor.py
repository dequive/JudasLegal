"""
Sistema de monitorização avançado para Muzaia
Colecta métricas de performance, saúde do sistema e alertas
"""

import psutil
import time
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass, asdict
import logging
import json
from collections import deque

logger = logging.getLogger(__name__)

@dataclass
class SystemMetrics:
    """Métricas do sistema"""
    timestamp: str
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_total_mb: float
    disk_percent: float
    disk_used_gb: float
    disk_total_gb: float
    network_sent_mb: float
    network_recv_mb: float
    active_connections: int
    process_count: int

@dataclass
class APIMetrics:
    """Métricas da API"""
    timestamp: str
    total_requests: int
    requests_per_minute: int
    average_response_time: float
    error_rate: float
    active_sessions: int
    cache_hit_ratio: float

@dataclass
class HealthStatus:
    """Estado de saúde do sistema"""
    status: str  # healthy, warning, critical
    components: Dict[str, bool]
    issues: List[str]
    uptime_seconds: int

class SystemMonitor:
    """Monitor principal do sistema"""
    
    def __init__(self, max_history: int = 1000):
        self.max_history = max_history
        self.system_metrics_history = deque(maxlen=max_history)
        self.api_metrics_history = deque(maxlen=max_history)
        self.start_time = time.time()
        self.request_log = deque(maxlen=10000)  # Log de requests
        self.error_log = deque(maxlen=1000)     # Log de erros
        self.is_monitoring = False
        
        # Thresholds para alertas
        self.cpu_threshold = 80.0
        self.memory_threshold = 85.0
        self.disk_threshold = 90.0
        self.error_rate_threshold = 5.0
    
    async def start_monitoring(self, interval: int = 60):
        """Iniciar monitorização contínua"""
        self.is_monitoring = True
        logger.info("Iniciando monitorização do sistema")
        
        while self.is_monitoring:
            try:
                # Coletar métricas do sistema
                system_metrics = self.collect_system_metrics()
                self.system_metrics_history.append(system_metrics)
                
                # Coletar métricas da API
                api_metrics = self.collect_api_metrics()
                self.api_metrics_history.append(api_metrics)
                
                # Verificar alertas
                await self.check_alerts(system_metrics, api_metrics)
                
                # Aguardar próximo ciclo
                await asyncio.sleep(interval)
                
            except Exception as e:
                logger.error(f"Erro na monitorização: {e}")
                await asyncio.sleep(interval)
    
    def stop_monitoring(self):
        """Parar monitorização"""
        self.is_monitoring = False
        logger.info("Monitorização parada")
    
    def collect_system_metrics(self) -> SystemMetrics:
        """Coletar métricas do sistema"""
        try:
            # CPU
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memória
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            memory_used_mb = memory.used / 1024 / 1024
            memory_total_mb = memory.total / 1024 / 1024
            
            # Disco
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            disk_used_gb = disk.used / 1024 / 1024 / 1024
            disk_total_gb = disk.total / 1024 / 1024 / 1024
            
            # Rede
            network = psutil.net_io_counters()
            network_sent_mb = network.bytes_sent / 1024 / 1024
            network_recv_mb = network.bytes_recv / 1024 / 1024
            
            # Processos e conexões
            process_count = len(psutil.pids())
            active_connections = len(psutil.net_connections())
            
            return SystemMetrics(
                timestamp=datetime.utcnow().isoformat(),
                cpu_percent=cpu_percent,
                memory_percent=memory_percent,
                memory_used_mb=round(memory_used_mb, 2),
                memory_total_mb=round(memory_total_mb, 2),
                disk_percent=disk_percent,
                disk_used_gb=round(disk_used_gb, 2),
                disk_total_gb=round(disk_total_gb, 2),
                network_sent_mb=round(network_sent_mb, 2),
                network_recv_mb=round(network_recv_mb, 2),
                active_connections=active_connections,
                process_count=process_count
            )
            
        except Exception as e:
            logger.error(f"Erro ao coletar métricas do sistema: {e}")
            return SystemMetrics(
                timestamp=datetime.utcnow().isoformat(),
                cpu_percent=0, memory_percent=0, memory_used_mb=0,
                memory_total_mb=0, disk_percent=0, disk_used_gb=0,
                disk_total_gb=0, network_sent_mb=0, network_recv_mb=0,
                active_connections=0, process_count=0
            )
    
    def collect_api_metrics(self) -> APIMetrics:
        """Coletar métricas da API"""
        now = datetime.utcnow()
        one_minute_ago = now - timedelta(minutes=1)
        
        # Filtrar requests do último minuto
        recent_requests = [
            req for req in self.request_log 
            if req.get('timestamp', now) > one_minute_ago
        ]
        
        # Calcular métricas
        total_requests = len(self.request_log)
        requests_per_minute = len(recent_requests)
        
        # Tempo médio de resposta
        response_times = [req.get('response_time', 0) for req in recent_requests if 'response_time' in req]
        average_response_time = sum(response_times) / len(response_times) if response_times else 0
        
        # Taxa de erro
        error_requests = [req for req in recent_requests if req.get('status_code', 200) >= 400]
        error_rate = (len(error_requests) / len(recent_requests) * 100) if recent_requests else 0
        
        # Sessões ativas (simulado)
        active_sessions = len(set(req.get('client_id', '') for req in recent_requests))
        
        # Cache hit ratio (obtido do cache service)
        cache_hit_ratio = 0.0
        try:
            from app.services.cache_service import cache_service
            stats = cache_service.get_stats()
            cache_hit_ratio = stats.get('hit_ratio', 0.0)
        except:
            pass
        
        return APIMetrics(
            timestamp=now.isoformat(),
            total_requests=total_requests,
            requests_per_minute=requests_per_minute,
            average_response_time=round(average_response_time, 3),
            error_rate=round(error_rate, 2),
            active_sessions=active_sessions,
            cache_hit_ratio=cache_hit_ratio
        )
    
    async def check_alerts(self, system_metrics: SystemMetrics, api_metrics: APIMetrics):
        """Verificar condições de alerta"""
        alerts = []
        
        # Alertas de sistema
        if system_metrics.cpu_percent > self.cpu_threshold:
            alerts.append(f"CPU alta: {system_metrics.cpu_percent}%")
        
        if system_metrics.memory_percent > self.memory_threshold:
            alerts.append(f"Memória alta: {system_metrics.memory_percent}%")
        
        if system_metrics.disk_percent > self.disk_threshold:
            alerts.append(f"Disco cheio: {system_metrics.disk_percent}%")
        
        # Alertas de API
        if api_metrics.error_rate > self.error_rate_threshold:
            alerts.append(f"Taxa de erro alta: {api_metrics.error_rate}%")
        
        if api_metrics.average_response_time > 5.0:
            alerts.append(f"Tempo de resposta alto: {api_metrics.average_response_time}s")
        
        # Log de alertas
        if alerts:
            logger.warning(f"Alertas detectados: {', '.join(alerts)}")
    
    def record_request(self, method: str, path: str, status_code: int, 
                      response_time: float, client_id: str = None):
        """Registar request para métricas"""
        request_data = {
            'timestamp': datetime.utcnow(),
            'method': method,
            'path': path,
            'status_code': status_code,
            'response_time': response_time,
            'client_id': client_id or 'unknown'
        }
        self.request_log.append(request_data)
    
    def record_error(self, error_type: str, message: str, path: str = None):
        """Registar erro para análise"""
        error_data = {
            'timestamp': datetime.utcnow(),
            'error_type': error_type,
            'message': message,
            'path': path
        }
        self.error_log.append(error_data)
    
    def get_health_status(self) -> HealthStatus:
        """Obter estado de saúde geral"""
        issues = []
        components = {
            'api': True,
            'database': True,
            'cache': True,
            'ai_service': True,
            'monitoring': True
        }
        
        # Verificar métricas recentes
        if self.system_metrics_history:
            latest = self.system_metrics_history[-1]
            
            if latest.cpu_percent > self.cpu_threshold:
                issues.append(f"CPU alta ({latest.cpu_percent}%)")
                
            if latest.memory_percent > self.memory_threshold:
                issues.append(f"Memória alta ({latest.memory_percent}%)")
                
            if latest.disk_percent > self.disk_threshold:
                issues.append(f"Disco cheio ({latest.disk_percent}%)")
        
        # Verificar erros recentes
        recent_errors = [
            err for err in self.error_log 
            if err['timestamp'] > datetime.utcnow() - timedelta(minutes=5)
        ]
        
        if len(recent_errors) > 10:
            issues.append(f"Muitos erros recentes ({len(recent_errors)})")
        
        # Determinar status geral
        if not issues:
            status = "healthy"
        elif len(issues) <= 2:
            status = "warning"
        else:
            status = "critical"
        
        uptime_seconds = int(time.time() - self.start_time)
        
        return HealthStatus(
            status=status,
            components=components,
            issues=issues,
            uptime_seconds=uptime_seconds
        )
    
    def get_metrics_summary(self) -> Dict:
        """Obter resumo das métricas"""
        if not self.system_metrics_history or not self.api_metrics_history:
            return {"error": "Dados insuficientes"}
        
        latest_system = self.system_metrics_history[-1]
        latest_api = self.api_metrics_history[-1]
        
        return {
            "system": asdict(latest_system),
            "api": asdict(latest_api),
            "health": asdict(self.get_health_status()),
            "history_count": {
                "system": len(self.system_metrics_history),
                "api": len(self.api_metrics_history),
                "requests": len(self.request_log),
                "errors": len(self.error_log)
            }
        }

# Instância global
system_monitor = SystemMonitor()