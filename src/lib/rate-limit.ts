import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/config/env";

/**
 * Rate limiting store interface para permitir diferentes implementações
 */
interface RateLimitStore {
  incr: (key: string) => Promise<number>;
  expire: (key: string, ttl: number) => Promise<void>;
  get: (key: string) => Promise<number | null>;
}

/**
 * Store em memória para desenvolvimento local
 * Não é persistente e é resetado quando o servidor reinicia
 */
class MemoryStore implements RateLimitStore {
  private store = new Map<string, { count: number; expiry: number }>();

  async incr(key: string): Promise<number> {
    const now = Date.now();
    const item = this.store.get(key);

    if (!item || now > item.expiry) {
      this.store.set(key, { count: 1, expiry: now + env.RATE_LIMIT_WINDOW_MS });
      return 1;
    }

    item.count++;
    this.store.set(key, item);
    return item.count;
  }

  async expire(key: string, ttl: number): Promise<void> {
    const item = this.store.get(key);
    if (item) {
      item.expiry = Date.now() + ttl;
      this.store.set(key, item);
    }
  }

  async get(key: string): Promise<number | null> {
    const item = this.store.get(key);
    if (!item || Date.now() > item.expiry) {
      this.store.delete(key);
      return null;
    }
    return item.count;
  }

  // Cleanup expired keys periodically
  private cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiry) {
        this.store.delete(key);
      }
    }
  }

  constructor() {
    // Executa limpeza a cada 5 minutos
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }
}

/**
 * Configuração do rate limiting
 */
interface RateLimitConfig {
  requests: number;
  windowMs: number; // Em milissegundos para cálculo interno
  prefix?: string;
}

// Diferentes configurações para diferentes tipos de rotas
export const RATE_LIMIT_CONFIGS = {
  // API geral - mais restritivo
  api: {
    requests: env.RATE_LIMIT_REQUESTS_PER_WINDOW,
    windowMs: 60000, // 1 minuto
    prefix: "api",
  } satisfies RateLimitConfig,

  // Autenticação - muito restritivo para prevenir ataques de força bruta
  auth: {
    requests: 5,
    windowMs: 60000,
    prefix: "auth",
  } satisfies RateLimitConfig,

  // Upload de arquivos - mais restritivo
  upload: {
    requests: 10,
    windowMs: 60000,
    prefix: "upload",
  } satisfies RateLimitConfig,

  // Busca/consulta - menos restritivo
  search: {
    requests: 200,
    windowMs: 60000,
    prefix: "search",
  } satisfies RateLimitConfig,
} as const;

/**
 * Cria instância do rate limiter baseado na configuração do ambiente
 */
function createRateLimiter(config: RateLimitConfig) {
  // Se temos Redis configurado, usa Upstash Redis
  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        config.requests,
        `${config.windowMs} ms`,
      ),
      prefix: `ratelimit:${config.prefix}`,
      analytics: true, // Habilita analytics no Upstash
    });
  }

  // Fallback para store em memória (desenvolvimento)
  const memoryStore = new MemoryStore();

  return new Ratelimit({
    redis: memoryStore as any, // Type casting necessário
    limiter: Ratelimit.slidingWindow(config.requests, `${config.windowMs} ms`),
    prefix: `ratelimit:${config.prefix}`,
  });
} // Instâncias dos rate limiters
export const rateLimiters = {
  api: createRateLimiter(RATE_LIMIT_CONFIGS.api),
  auth: createRateLimiter(RATE_LIMIT_CONFIGS.auth),
  upload: createRateLimiter(RATE_LIMIT_CONFIGS.upload),
  search: createRateLimiter(RATE_LIMIT_CONFIGS.search),
} as const;

/**
 * Tipo para os rate limiters disponíveis
 */
export type RateLimiterType = keyof typeof rateLimiters;

/**
 * Verifica rate limit para um identificador
 */
export async function checkRateLimit(
  type: RateLimiterType,
  identifier: string,
) {
  if (!env.RATE_LIMIT_ENABLED) {
    return { success: true, remaining: 999, reset: Date.now() + 60000 };
  }

  const ratelimit = rateLimiters[type];
  const result = await ratelimit.limit(identifier);

  return {
    success: result.success,
    remaining: result.remaining,
    reset: result.reset,
    limit: result.limit,
  };
}

/**
 * Gera um identificador único baseado no IP e opcionalmente no user ID
 */
export function generateRateLimitIdentifier(
  request: Request,
  userId?: string,
): string {
  // Pega o IP real considerando proxies (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

  // Se temos userId, combina com IP para maior granularidade
  if (userId) {
    return `${ip}:${userId}`;
  }

  return ip;
}

/**
 * Headers de resposta para rate limiting (seguindo padrão HTTP)
 */
export function createRateLimitHeaders(result: {
  success: boolean;
  remaining: number;
  reset: number;
  limit?: number;
}) {
  const headers = new Headers();

  if (result.limit) {
    headers.set("X-RateLimit-Limit", result.limit.toString());
  }
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", Math.ceil(result.reset / 1000).toString());

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    headers.set("Retry-After", retryAfter.toString());
  }

  return headers;
}
