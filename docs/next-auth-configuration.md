# NextAuth.js Configuration

Para utilizar o [NextAuth.js](https://next-auth.js.org/) neste projeto, precisamos definir corretamente algumas variáveis de ambiente no arquivo `.env`. Essas variáveis controlam os provedores de login (como Google e Facebook), o ambiente de execução e a segurança da autenticação.

Recomenda-se utilizar o arquivo [.env.example](../.env.example) como referência para preencher o seu `.env` local.

## 📁 Arquivo .env

Adicione as seguintes variáveis no seu .env:

```env
NEXTAUTH_URL="http://localhost:3000" # The URL of your Next.js application
AUTH_TRUST_HOST=True # [UntrustedHost]: Host must be trusted.
AUTH_SECRET="secret" # Added by `npx auth secret`. Read more: https://cli.authjs.dev
AUTH_GOOGLE_ID="your-auth-google-client-id"
AUTH_GOOGLE_SECRET="your-auth-google-client-secret"
AUTH_FACEBOOK_ID="your-auth-facebook-client-id"
AUTH_FACEBOOK_SECRET="your-auth-facebook-client-secret"
```

## 🔑 Como gerar o AUTH_SECRET

Essa chave é usada para assinar e criptografar tokens de sessão. **Nunca** compartilhe essa chave publicamente.

Você pode gerar de duas formas:

```bash
# Usando o OpenSSL
openssl rand -base64 32

# Ou usando o cliente do NextAuth
npx auth secret --raw
```

Copie a chave gerada e adicione em `AUTH_SECRET`.
