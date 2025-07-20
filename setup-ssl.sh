#!/bin/bash

echo "🔒 Configurar SSL para Muzaia no Droplet"
echo "========================================"
echo ""

DROPLET_IP="164.92.160.176"

echo "Este script configura SSL gratuito com Let's Encrypt"
echo ""

read -p "Tem um domínio apontado para 164.92.160.176? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ SSL precisa de domínio"
    echo ""
    echo "Para configurar domínio:"
    echo "1. Registar domínio (ex: muzaia.com)"
    echo "2. Configurar DNS:"
    echo "   A    @    164.92.160.176"
    echo "   A    www  164.92.160.176"
    echo "3. Aguardar propagação (até 24h)"
    echo "4. Executar este script novamente"
    exit 1
fi

read -p "Qual o domínio (ex: muzaia.com): " DOMAIN

echo ""
echo "🔧 Configurando SSL para $DOMAIN..."

# Script para executar no droplet
ssh root@$DROPLET_IP << EOF
    echo "📦 Instalando Certbot..."
    apt update
    apt install -y certbot python3-certbot-nginx
    
    echo "🔒 Obtendo certificado SSL..."
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
    
    echo "🔄 Configurando renovação automática..."
    systemctl enable certbot.timer
    systemctl start certbot.timer
    
    echo "✅ SSL configurado!"
    echo ""
    echo "🧪 Testando HTTPS..."
    curl -I https://$DOMAIN/health | head -1
    
    echo ""
    echo "📊 Status do certificado:"
    certbot certificates
EOF

echo ""
echo "✅ SSL CONFIGURADO!"
echo "=================="
echo ""
echo "🌐 URLs HTTPS:"
echo "• https://$DOMAIN"
echo "• https://$DOMAIN/health"
echo "• https://$DOMAIN/api/chat"
echo ""
echo "🔄 Renovação automática configurada"
echo "📅 Certificado válido por 90 dias"
echo ""
echo "🔧 Para renovar manualmente:"
echo "ssh root@164.92.160.176 'certbot renew'"