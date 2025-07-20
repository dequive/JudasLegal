#!/usr/bin/env python3
"""
Teste directo da API de autenticação
"""

import requests
import json
import time

def test_auth_api():
    """Testar a API de autenticação directamente"""
    
    base_url = "http://localhost:8000"
    
    print("🔧 Testando API de autenticação...")
    
    # Teste 1: Health check
    print("1. Verificando health do sistema...")
    try:
        response = requests.get(f"{base_url}/api/health", timeout=5)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Erro no health check: {e}")
        return False
    
    # Teste 2: Verificar se endpoint auth existe
    print("2. Testando endpoint de autenticação...")
    try:
        login_data = {
            "username": "admin",
            "password": "admin123"
        }
        
        print(f"   Enviando dados: {login_data}")
        response = requests.post(
            f"{base_url}/api/auth/login",
            json=login_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Login bem-sucedido!")
            print(f"   Token: {data.get('access_token', 'N/A')[:30]}...")
            return True
        else:
            print(f"   ❌ Erro no login: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro na requisição: {e}")
        return False

if __name__ == "__main__":
    success = test_auth_api()
    if success:
        print("\n✅ API de autenticação funcional!")
    else:
        print("\n🚫 API de autenticação com problemas!")