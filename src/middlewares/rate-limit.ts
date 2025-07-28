import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import {
  checkRateLimit,
  generateRateLimitIdentifier,
  createRateLimitHeaders,
  type RateLimiterType,
} from "@/lib/rate-limit";

/**
 * Higher-order function para adicionar rate limiting a API routes
 *
 * @param rateLimiterType - Tipo de rate limiter a ser usado
 * @param handler - Handler da API route original
 * @returns Handler com rate limiting aplicado
 */
export function withRateLimit<T extends any[]>(
  rateLimiterType: RateLimiterType,
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // Gera identificador para rate limiting
      // Tenta pegar user ID do token se disponível
      const token = await getToken({ req, secret: process.env.AUTH_SECRET });
      const userId = token?.sub;
      const identifier = generateRateLimitIdentifier(req, userId);

      // Verifica rate limit
      const rateLimitResult = await checkRateLimit(rateLimiterType, identifier);
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

      // Se rate limit foi excedido
      if (!rateLimitResult.success) {
        return new NextResponse(
          JSON.stringify({
            error: "Rate limit exceeded",
            message: "Too many requests. Please try again later.",
            retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
            type: rateLimiterType,
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...Object.fromEntries(rateLimitHeaders.entries()),
            },
          },
        );
      }

      // Executa o handler original
      const response = await handler(req, ...args);

      // Adiciona headers de rate limit na resposta
      rateLimitHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });

      return response;
    } catch (error) {
      console.error("Rate limiting error:", error);

      // Em caso de erro no rate limiting, permite a requisição continuar
      // mas loga o erro para investigação
      return handler(req, ...args);
    }
  };
}

/**
 * Middleware específico para rate limiting em API routes
 * Uso: await applyRateLimit(req, "auth") antes do processamento da API
 */
export async function applyRateLimit(
  req: NextRequest,
  rateLimiterType: RateLimiterType,
  userId?: string,
): Promise<NextResponse | null> {
  try {
    const identifier = generateRateLimitIdentifier(req, userId);
    const rateLimitResult = await checkRateLimit(rateLimiterType, identifier);

    if (!rateLimitResult.success) {
      const rateLimitHeaders = createRateLimitHeaders(rateLimitResult);

      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
          type: rateLimiterType,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            ...Object.fromEntries(rateLimitHeaders.entries()),
          },
        },
      );
    }

    // Retorna null se rate limit passou (requisição pode continuar)
    return null;
  } catch (error) {
    console.error("Rate limiting error:", error);

    // Em caso de erro, permite a requisição continuar
    return null;
  }
}

/**
 * Tipos para facilitar o uso
 */
export type RateLimitedHandler<T extends any[] = []> = (
  req: NextRequest,
  ...args: T
) => Promise<NextResponse>;

/**
 * Decorators para diferentes tipos de rate limiting
 */
export const withApiRateLimit = <T extends any[]>(
  handler: RateLimitedHandler<T>,
) => withRateLimit("api", handler);

export const withAuthRateLimit = <T extends any[]>(
  handler: RateLimitedHandler<T>,
) => withRateLimit("auth", handler);

export const withUploadRateLimit = <T extends any[]>(
  handler: RateLimitedHandler<T>,
) => withRateLimit("upload", handler);

export const withSearchRateLimit = <T extends any[]>(
  handler: RateLimitedHandler<T>,
) => withRateLimit("search", handler);
