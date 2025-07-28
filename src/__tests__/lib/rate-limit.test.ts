import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock do env ANTES de importar qualquer módulo que o use
vi.mock("@/config/env", () => ({
  env: {
    NODE_ENV: "test",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    AUTH_GOOGLE_ID: "test-google-id",
    AUTH_GOOGLE_SECRET: "test-google-secret",
    AUTH_FACEBOOK_ID: "test-facebook-id",
    AUTH_FACEBOOK_SECRET: "test-facebook-secret",
    SECURE_COOKIES_ENABLED: false,
    LOG_FILE_ENABLED: false,
    NEXT_PUBLIC_HOTJAR_ID: undefined,
    UPSTASH_REDIS_REST_URL: undefined,
    UPSTASH_REDIS_REST_TOKEN: undefined,
    RATE_LIMIT_ENABLED: true,
    RATE_LIMIT_REQUESTS_PER_WINDOW: 100,
    RATE_LIMIT_WINDOW_MS: 60000,
  },
}));

import {
  generateRateLimitIdentifier,
  createRateLimitHeaders,
  RATE_LIMIT_CONFIGS,
} from "@/lib/rate-limit";

describe("Rate Limiting Utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("generateRateLimitIdentifier", () => {
    it("deve gerar identificador baseado no IP", () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockImplementation((header: string) => {
            if (header === "x-forwarded-for") return "192.168.1.1, 10.0.0.1";
            if (header === "x-real-ip") return "192.168.1.1";
            return null;
          }),
        },
      } as any;

      const identifier = generateRateLimitIdentifier(mockRequest);
      expect(identifier).toBe("192.168.1.1");
    });

    it("deve gerar identificador com userId quando fornecido", () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockImplementation((header: string) => {
            if (header === "x-forwarded-for") return "192.168.1.1";
            return null;
          }),
        },
      } as any;

      const identifier = generateRateLimitIdentifier(mockRequest, "user123");
      expect(identifier).toBe("192.168.1.1:user123");
    });

    it("deve usar 'unknown' quando IP não estiver disponível", () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockReturnValue(null),
        },
      } as any;

      const identifier = generateRateLimitIdentifier(mockRequest);
      expect(identifier).toBe("unknown");
    });

    it("deve priorizar x-forwarded-for e pegar primeiro IP", () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockImplementation((header: string) => {
            if (header === "x-forwarded-for")
              return "203.0.113.1, 198.51.100.1, 192.168.1.1";
            if (header === "x-real-ip") return "10.0.0.1";
            return null;
          }),
        },
      } as any;

      const identifier = generateRateLimitIdentifier(mockRequest);
      expect(identifier).toBe("203.0.113.1");
    });

    it("deve usar x-real-ip quando x-forwarded-for não estiver disponível", () => {
      const mockRequest = {
        headers: {
          get: vi.fn().mockImplementation((header: string) => {
            if (header === "x-forwarded-for") return null;
            if (header === "x-real-ip") return "203.0.113.1";
            return null;
          }),
        },
      } as any;

      const identifier = generateRateLimitIdentifier(mockRequest);
      expect(identifier).toBe("203.0.113.1");
    });
  });

  describe("createRateLimitHeaders", () => {
    it("deve criar headers corretos para requisição bem-sucedida", () => {
      const result = {
        success: true,
        remaining: 4,
        reset: Date.now() + 60000,
        limit: 5,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers.get("X-RateLimit-Limit")).toBe("5");
      expect(headers.get("X-RateLimit-Remaining")).toBe("4");
      expect(headers.get("X-RateLimit-Reset")).toBeTruthy();
      expect(headers.get("Retry-After")).toBeNull();
    });

    it("deve criar headers corretos para rate limit excedido", () => {
      const resetTime = Date.now() + 30000; // 30 segundos no futuro
      const result = {
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: 5,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers.get("X-RateLimit-Limit")).toBe("5");
      expect(headers.get("X-RateLimit-Remaining")).toBe("0");
      expect(headers.get("Retry-After")).toBe("30");
    });

    it("deve funcionar sem limite definido", () => {
      const result = {
        success: true,
        remaining: 10,
        reset: Date.now() + 60000,
      };

      const headers = createRateLimitHeaders(result);

      expect(headers.get("X-RateLimit-Limit")).toBeNull();
      expect(headers.get("X-RateLimit-Remaining")).toBe("10");
      expect(headers.get("X-RateLimit-Reset")).toBeTruthy();
    });

    it("deve calcular Retry-After corretamente", () => {
      const resetTime = Date.now() + 45000; // 45 segundos no futuro
      const result = {
        success: false,
        remaining: 0,
        reset: resetTime,
        limit: 10,
      };

      const headers = createRateLimitHeaders(result);
      const retryAfter = parseInt(headers.get("Retry-After")!);

      // Deve ser aproximadamente 45 segundos (com margem de 2 segundos para processamento)
      expect(retryAfter).toBeGreaterThanOrEqual(43);
      expect(retryAfter).toBeLessThanOrEqual(45);
    });
  });

  describe("RATE_LIMIT_CONFIGS", () => {
    it("deve ter configurações válidas para todos os tipos", () => {
      expect(RATE_LIMIT_CONFIGS.api).toHaveProperty("requests");
      expect(RATE_LIMIT_CONFIGS.api).toHaveProperty("windowMs");
      expect(RATE_LIMIT_CONFIGS.api).toHaveProperty("prefix");

      expect(RATE_LIMIT_CONFIGS.auth).toHaveProperty("requests");
      expect(RATE_LIMIT_CONFIGS.upload).toHaveProperty("requests");
      expect(RATE_LIMIT_CONFIGS.search).toHaveProperty("requests");
    });

    it("deve ter limites específicos para cada tipo", () => {
      expect(RATE_LIMIT_CONFIGS.auth.requests).toBe(5);
      expect(RATE_LIMIT_CONFIGS.upload.requests).toBe(10);
      expect(RATE_LIMIT_CONFIGS.search.requests).toBe(200);
    });

    it("deve ter hierarquia de limites adequada", () => {
      // Auth é o mais restritivo
      expect(RATE_LIMIT_CONFIGS.auth.requests).toBeLessThan(
        RATE_LIMIT_CONFIGS.upload.requests,
      );
      expect(RATE_LIMIT_CONFIGS.upload.requests).toBeLessThan(
        RATE_LIMIT_CONFIGS.search.requests,
      );
    });

    it("deve usar janela de tempo em milissegundos", () => {
      expect(RATE_LIMIT_CONFIGS.api.windowMs).toBe(60000);
      expect(RATE_LIMIT_CONFIGS.auth.windowMs).toBe(60000);
      expect(RATE_LIMIT_CONFIGS.upload.windowMs).toBe(60000);
      expect(RATE_LIMIT_CONFIGS.search.windowMs).toBe(60000);
    });

    it("deve ter prefixos únicos para cada tipo", () => {
      const prefixes = [
        RATE_LIMIT_CONFIGS.api.prefix,
        RATE_LIMIT_CONFIGS.auth.prefix,
        RATE_LIMIT_CONFIGS.upload.prefix,
        RATE_LIMIT_CONFIGS.search.prefix,
      ];

      const uniquePrefixes = new Set(prefixes);
      expect(uniquePrefixes.size).toBe(prefixes.length);
    });

    it("deve ter prefixos descritivos", () => {
      expect(RATE_LIMIT_CONFIGS.api.prefix).toBe("api");
      expect(RATE_LIMIT_CONFIGS.auth.prefix).toBe("auth");
      expect(RATE_LIMIT_CONFIGS.upload.prefix).toBe("upload");
      expect(RATE_LIMIT_CONFIGS.search.prefix).toBe("search");
    });
  });
});
