import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "@/utils/crypto";

describe("🔐 Crypto Utility - Criptografia e Descriptografia", () => {
  describe("✅ Casos de Sucesso", () => {
    it("deve criptografar e descriptografar uma string simples", () => {
      const testData = "dados-sensiveis";
      const encrypted = encrypt(testData);

      // Verifica que a criptografia funciona
      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe("string");
      expect(encrypted).not.toBe(testData);

      // Verifica que o formato está correto (iv:conteudo)
      expect(encrypted).toContain(":");
      const [iv, content] = encrypted.split(":");
      expect(iv).toHaveLength(32); // IV de 16 bytes = 32 caracteres hex
      expect(content.length).toBeGreaterThan(0);

      // Verifica que a descriptografia retorna o valor original
      const decrypted = decrypt(encrypted);
      expect(decrypted).toBe(testData);
    });

    it("deve criptografar tokens de autenticação", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
      const encrypted = encrypt(token);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(token);
    });

    it("deve criptografar códigos de confirmação numéricos", () => {
      const code = "123456";
      const encrypted = encrypt(code);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(code);
    });

    it("deve criptografar emails", () => {
      const email = "usuario@exemplo.com";
      const encrypted = encrypt(email);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(email);
    });

    it("deve criptografar dados com caracteres especiais", () => {
      const specialData = "Olá! @#$%^&*() Teste 123 🔐";
      const encrypted = encrypt(specialData);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(specialData);
    });

    it("deve gerar criptografias diferentes para o mesmo dado", () => {
      const testData = "mesmo-dado";
      const encrypted1 = encrypt(testData);
      const encrypted2 = encrypt(testData);

      // IVs diferentes devem gerar resultados diferentes
      expect(encrypted1).not.toBe(encrypted2);

      // Mas ambos devem descriptografar para o mesmo valor
      expect(decrypt(encrypted1)).toBe(testData);
      expect(decrypt(encrypted2)).toBe(testData);
    });

    it("deve criptografar e descriptografar strings longas", () => {
      const longString = "A".repeat(10000);
      const encrypted = encrypt(longString);
      const decrypted = decrypt(encrypted);

      expect(decrypted).toBe(longString);
      expect(decrypted).toHaveLength(10000);
    });
  });

  describe("❌ Casos de Erro", () => {
    it("deve lançar erro ao tentar criptografar string vazia", () => {
      expect(() => encrypt("")).toThrow("data deve ser uma string não vazia.");
    });

    it("deve lançar erro ao tentar criptografar dados não-string", () => {
      // @ts-expect-error - Teste de tipo inválido
      expect(() => encrypt(null)).toThrow(
        "data deve ser uma string não vazia.",
      );

      // @ts-expect-error - Teste de tipo inválido
      expect(() => encrypt(undefined)).toThrow(
        "data deve ser uma string não vazia.",
      );

      // @ts-expect-error - Teste de tipo inválido
      expect(() => encrypt(123)).toThrow("data deve ser uma string não vazia.");
    });

    it("deve lançar erro ao descriptografar string vazia", () => {
      expect(() => decrypt("")).toThrow(
        "encryptedData deve ser uma string não vazia.",
      );
    });

    it("deve lançar erro ao descriptografar formato inválido", () => {
      expect(() => decrypt("dados-invalidos")).toThrow(
        "encryptedData deve estar no formato 'iv:conteudo'.",
      );
    });

    it("deve lançar erro ao descriptografar dados sem separador", () => {
      expect(() => decrypt("semSeparador123")).toThrow(
        "encryptedData deve estar no formato 'iv:conteudo'.",
      );
    });

    it("deve lançar erro ao descriptografar dados com IV inválido", () => {
      expect(() => decrypt("iv-invalido:conteudo")).toThrow(
        "Erro ao descriptografar dados",
      );
    });

    it("deve lançar erro ao descriptografar dados corrompidos", () => {
      const encrypted = encrypt("teste");
      const [iv] = encrypted.split(":");
      const corruptedData = `${iv}:conteudo-corrompido-xyz`;

      expect(() => decrypt(corruptedData)).toThrow(
        "Erro ao descriptografar dados",
      );
    });

    it("deve lançar erro ao descriptografar com IV de tamanho incorreto", () => {
      // IV muito curto (deve ter 32 caracteres hex = 16 bytes)
      expect(() => decrypt("abc123:conteudo")).toThrow(
        "Erro ao descriptografar dados",
      );
    });

    it("deve lançar erro ao descriptografar dados não-string", () => {
      // @ts-expect-error - Teste de tipo inválido
      expect(() => decrypt(null)).toThrow(
        "encryptedData deve ser uma string não vazia.",
      );

      // @ts-expect-error - Teste de tipo inválido
      expect(() => decrypt(undefined)).toThrow(
        "encryptedData deve ser uma string não vazia.",
      );
    });
  });

  describe("🔒 Segurança", () => {
    it("não deve permitir leitura do dado criptografado em texto puro", () => {
      const sensitiveData = "senha-super-secreta-123";
      const encrypted = encrypt(sensitiveData);

      // O dado criptografado não deve conter o texto original
      expect(encrypted).not.toContain("senha");
      expect(encrypted).not.toContain("secreta");
      expect(encrypted).not.toContain("123");
    });

    it("deve usar IV único a cada criptografia (verificação de aleatoriedade)", () => {
      const testData = "teste";
      const encrypted1 = encrypt(testData);
      const encrypted2 = encrypt(testData);
      const encrypted3 = encrypt(testData);

      const iv1 = encrypted1.split(":")[0];
      const iv2 = encrypted2.split(":")[0];
      const iv3 = encrypted3.split(":")[0];

      // Todos os IVs devem ser diferentes
      expect(iv1).not.toBe(iv2);
      expect(iv2).not.toBe(iv3);
      expect(iv1).not.toBe(iv3);
    });
  });

  describe("⚡ Performance", () => {
    it("deve criptografar e descriptografar rapidamente", () => {
      const testData = "teste-performance";
      const iterations = 1000;

      const startTime = Date.now();

      for (let i = 0; i < iterations; i++) {
        const encrypted = encrypt(testData);
        decrypt(encrypted);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Deve processar 1000 operações em menos de 1 segundo
      expect(duration).toBeLessThan(1000);
    });
  });
});
