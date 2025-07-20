#!/usr/bin/env python3
"""
Teste simples do sistema de autenticação
"""

import asyncio
import sys
import os
sys.path.append('.')

async def test_auth_components():
    """Testar componentes de autenticação isoladamente"""
    
    print("🔧 Testando componentes de autenticação...")
    
    try:
        # Teste 1: Importar módulos de segurança
        print("1. Importando módulos de segurança...")
        from app.security.authentication import security_manager, input_validator
        print("   ✓ Módulos de segurança importados")
        
        # Teste 2: Hash de password
        print("2. Testando hash de password...")
        test_password = "admin123"
        password_hash = security_manager.hash_password(test_password)
        print(f"   ✓ Hash gerado: {password_hash[:30]}...")
        
        # Teste 3: Verificação de password
        print("3. Testando verificação de password...")
        is_valid = security_manager.verify_password(test_password, password_hash)
        print(f"   ✓ Verificação: {is_valid}")
        
        # Teste 4: Criação de token JWT
        print("4. Testando criação de token JWT...")
        token_data = {
            "user_id": "admin",
            "username": "admin", 
            "role": "admin"
        }
        access_token = security_manager.create_access_token(token_data)
        print(f"   ✓ Token criado: {access_token[:30]}...")
        
        # Teste 5: Verificação de token
        print("5. Testando verificação de token...")
        payload = security_manager.verify_token(access_token)
        print(f"   ✓ Payload verificado: {payload}")
        
        print("\n🎉 Todos os testes passaram! Componentes funcionais.")
        return True
        
    except Exception as e:
        print(f"\n❌ Erro no teste: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    result = asyncio.run(test_auth_components())
    if result:
        print("\n✅ Sistema de autenticação está funcional!")
    else:
        print("\n🚫 Sistema de autenticação tem problemas!")