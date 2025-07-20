# 🚀 Como Executar o Deploy

## Passo 1: Abrir Terminal
1. No Replit, procure o painel "Shell" (geralmente na parte inferior)
2. Se não estiver visível, pressione `Ctrl + Shift + S` ou vá em `Tools > Shell`

## Passo 2: Navegar para a Pasta do Projeto
```bash
# Você já deve estar na pasta correta, mas confirme:
pwd
```
Deve mostrar algo como `/home/runner/Judas` ou similar.

## Passo 3: Verificar se o Script Existe
```bash
ls -la deploy-now.sh
```
Deve mostrar o arquivo com permissões de execução.

## Passo 4: Executar o Deploy
```bash
./deploy-now.sh
```

## O que Vai Acontecer:
1. **Instalação**: O script vai instalar o Vercel CLI automaticamente
2. **Login**: Será solicitado que faça login no Vercel (use GitHub)
3. **Configuração**: Todas as variáveis serão configuradas automaticamente
4. **Deploy**: As 3 partes da aplicação serão deployadas
5. **URLs**: Você receberá as URLs finais da aplicação

## Tempo Estimado: 5-10 minutos

## Se Dar Algum Erro:
- Copie a mensagem de erro e me envie
- Posso ajudar a resolver rapidamente

---

**Execute agora: `./deploy-now.sh`**