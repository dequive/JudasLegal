# 🔐 Como Fazer Login no Vercel - Verification Code

## O que Está Acontecendo
Quando você executa `./deploy-now.sh`, o Vercel CLI pede para fazer login e mostra um "verification code".

## Onde Encontrar o Verification Code

### Opção 1: No Terminal (Mais Comum)
1. **O código aparece no próprio terminal** após executar o comando
2. **Formato**: Código de 4-6 dígitos ou letras
3. **Exemplo**: `abc-def` ou `123456`

### Opção 2: No Browser (Navegador)
1. O Vercel CLI pode **abrir automaticamente** uma página no browser
2. **Se não abrir**, copie o link que aparece no terminal
3. **Cole** o link no navegador
4. **Faça login** com GitHub, Google ou email
5. O código aparecerá na página

### Opção 3: Email
1. Se escolheu login por **email**
2. **Verifique** sua caixa de entrada
3. O Vercel enviará um **código de verificação**

## Passo-a-Passo Visual

```
Terminal mostra algo assim:
> We sent you an email with a verification code.
> Alternatively, verify with: abc-def
> ? Enter verification code: _

OU

> Visit the following URL to log in:
> https://vercel.com/login?next=%2Fapi%2Flogin%3Fmode%3Dcli
> ? Enter verification code: _
```

## O que Fazer:

1. **Se vê o código no terminal**: Digite o código e pressione Enter
2. **Se vê um link**: Abra o link, faça login, volte ao terminal
3. **Se não funcionar**: Escolha login com GitHub (mais fácil)

## Login com GitHub (Recomendado)
```bash
# Se der problema, cancele (Ctrl+C) e tente:
vercel login --github
```

## Troubleshooting

### Código não funciona
- Verifique se digitou corretamente (sem espaços)
- Tente novamente com `vercel login`

### Email não chegou
- Verifique spam/lixo eletrônico
- Aguarde alguns minutos
- Use login com GitHub

### Link não abre
- Copie manualmente o link do terminal
- Cole em uma nova aba do navegador

---

**Dica**: GitHub é geralmente o método mais rápido e confiável!