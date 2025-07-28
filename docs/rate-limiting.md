# Rate Limiting Configuration

Este documento descreve como o sistema de rate limiting está configurado e como usá-lo efetivamente no projeto.

## Visão Geral

O rate limiting protege a aplicação contra abuso de requisições, ataques DDoS e garante uma distribuição justa de recursos entre os usuários.

### Características Principais

- **Configurável por ambiente**: Pode ser habilitado/desabilitado via variáveis de ambiente
- **Diferentes limites por tipo de rota**: Auth, API, Upload, Search
- **Store flexível**: Redis para produção, memória para desenvolvimento
- **Headers padrão HTTP**: Seguindo RFC 6585 e boas práticas da indústria
- **Integração transparente**: Funciona automaticamente no middleware e pode ser aplicado em API routes específicas

## Configuração

### Variáveis de Ambiente

```bash
# Habilitar/desabilitar rate limiting
RATE_LIMIT_ENABLED=true

# Configuração padrão para APIs
RATE_LIMIT_REQUESTS_PER_WINDOW=100  # Número de requisições por janela
RATE_LIMIT_WINDOW_MS=60000          # Janela de tempo em ms (1 minuto)

# Upstash Redis (Opcional - para produção)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Tipos de Rate Limiting

| Tipo     | Limite  | Janela | Uso                  |
| -------- | ------- | ------ | -------------------- |
| `auth`   | 5 req   | 1 min  | Autenticação e login |
| `api`    | 100 req | 1 min  | APIs gerais          |
| `upload` | 10 req  | 1 min  | Upload de arquivos   |
| `search` | 200 req | 1 min  | Busca e consultas    |

## Uso Automático

O rate limiting é aplicado automaticamente pelo middleware em todas as rotas protegidas:

```typescript
// src/middleware.ts
export const config = {
  matcher: [
    "/api/((?!auth|health).*)",
    "/auth/logout",
    "/employee/:path*",
    "/patient/:path*",
    "/user/:path*",
  ],
};
```

### Headers de Resposta

Todas as requisições incluem headers de rate limiting:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642684800
Retry-After: 30 (apenas quando limite excedido)
```

## Uso Manual em API Routes

### Método 1: Higher-Order Function (Recomendado)

```typescript
import { withApiRateLimit, withAuthRateLimit } from "@/middlewares/rate-limit";

// Para APIs gerais
async function getUserHandler(req: NextRequest) {
  // Lógica da API...
  return NextResponse.json(data);
}

export const GET = withApiRateLimit(getUserHandler);

// Para autenticação (mais restritivo)
async function loginHandler(req: NextRequest) {
  // Lógica de login...
  return NextResponse.json(result);
}

export const POST = withAuthRateLimit(loginHandler);
```

### Método 2: Middleware Manual

```typescript
import { applyRateLimit } from "@/middlewares/rate-limit";

export async function POST(req: NextRequest) {
  // Aplica rate limiting primeiro
  const rateLimitResponse = await applyRateLimit(req, "auth");
  if (rateLimitResponse) {
    return rateLimitResponse; // Rate limit excedido
  }

  // Continua com a lógica da API...
  return NextResponse.json(data);
}
```

### Método 3: Rate Limiting por Usuário

```typescript
import { getToken } from "next-auth/jwt";
import { applyRateLimit } from "@/middlewares/rate-limit";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  const userId = token?.sub;

  // Rate limiting combinando IP + User ID
  const rateLimitResponse = await applyRateLimit(req, "api", userId);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Lógica da API...
}
```

## Estratégias de Identificação

O sistema usa diferentes estratégias para identificar usuários:

1. **IP + User ID** (quando autenticado): Mais granular e justo
2. **IP apenas** (quando não autenticado): Proteção básica
3. **Headers de proxy**: Considera `X-Forwarded-For` e `X-Real-IP`

```typescript
// Geração automática do identificador
const identifier = generateRateLimitIdentifier(req, userId);
// Resultado: "192.168.1.1:user123" ou "192.168.1.1"
```

## Store de Dados

### Desenvolvimento (Memory Store)

- **Vantagens**: Sem dependências externas, setup simples
- **Desvantagens**: Não persiste entre restarts, limitado a uma instância
- **Uso**: Desenvolvimento local

### Produção (Redis/Upstash)

- **Vantagens**: Persistente, distribuído, escalável
- **Desvantagens**: Requer configuração externa
- **Uso**: Produção, staging

```typescript
// Configuração automática baseada em env vars
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  // Usa Redis
} else {
  // Usa Memory Store
}
```

## Monitoramento e Debugging

### Logs

O sistema loga automaticamente quando há erros no rate limiting:

```typescript
console.error("Rate limiting error:", error);
// Em caso de erro, permite a requisição continuar
```

### Analytics (Upstash)

Quando usando Upstash Redis, analytics são automaticamente habilitadas:

```typescript
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(requests, window),
  analytics: true, // Habilita analytics no dashboard Upstash
});
```

### Teste Manual

```bash
# Teste de rate limiting local
for i in {1..10}; do
  curl -w "%{http_code}\n" http://localhost:3000/api/user
done

# Deve retornar 200 para as primeiras requisições e 429 quando exceder
```

## Customização

### Novos Tipos de Rate Limiting

```typescript
// src/lib/rate-limit.ts
export const RATE_LIMIT_CONFIGS = {
  // Adicionar novo tipo
  payment: {
    requests: 3,
    window: "1 m",
    prefix: "payment",
  },
  // ...configs existentes
} as const;

// Criar decorator
export const withPaymentRateLimit = <T extends any[]>(
  handler: RateLimitedHandler<T>,
) => withRateLimit("payment", handler);
```

### Rate Limiting Condicional

```typescript
export async function POST(req: NextRequest) {
  const token = await getToken({ req });

  // Rate limiting mais restritivo para usuários não verificados
  const rateLimiterType = token?.emailVerified ? "api" : "auth";

  const rateLimitResponse = await applyRateLimit(req, rateLimiterType);
  if (rateLimitResponse) return rateLimitResponse;

  // Lógica da API...
}
```

## Boas Práticas

1. **Use rate limiting apropriado por endpoint**:

   - `auth` para login/registro
   - `upload` para uploads de arquivo
   - `search` para endpoints de busca
   - `api` para endpoints gerais

2. **Combine IP + User ID** quando possível para maior granularidade

3. **Configure alertas** para rate limits frequentemente excedidos

4. **Documente limites** para desenvolvedores frontend

5. **Teste com carga** antes de deploy em produção

6. **Monitor analytics** no dashboard do Upstash

## Troubleshooting

### Rate Limiting Muito Restritivo

```bash
# Aumentar limites via env vars
RATE_LIMIT_REQUESTS_PER_WINDOW=200
RATE_LIMIT_WINDOW_MS=60000
```

### Store Redis Indisponível

O sistema automaticamente faz fallback para memory store se Redis não estiver disponível.

### Headers Não Aparecem

Verifique se o middleware está sendo executado:

```typescript
// Verificar em src/middleware.ts
export const config = {
  matcher: ["/api/seu-endpoint"], // Deve incluir sua rota
};
```

## Segurança

- **Bypass Protection**: Rate limiting é a primeira verificação no middleware
- **Error Handling**: Erros no rate limiting não bloqueiam requisições legítimas
- **IP Spoofing**: Considera múltiplos headers de IP para lidar com proxies
- **DoS Protection**: Memory store tem limpeza automática para evitar vazamentos

## Performance

- **Memory Store**: ~1ms de latência
- **Redis Store**: ~10-50ms de latência (depende da rede)
- **Cleanup**: Memory store limpa entradas expiradas a cada 5 minutos
- **Overhead**: Mínimo impacto na performance da aplicação
