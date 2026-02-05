import crypto from "crypto";

import { env } from "@/config/env";

/**
 * 🔐 Utilitário de Criptografia e Descriptografia de Dados Sensíveis
 *
 * Este módulo fornece funções para proteger informações confidenciais usando o
 * algoritmo AES-256-CBC, um dos mais seguros e amplamente utilizados.
 *
 * 📌 Casos de Uso:
 * - Códigos de confirmação enviados por email
 * - Tokens temporários de autenticação
 * - Dados que não devem ser armazenados em texto puro
 * - Informações sensíveis de usuários
 *
 * 🔧 Funcionamento:
 * - Algoritmo: AES-256-CBC (Advanced Encryption Standard)
 * - Chave: 32 caracteres (256 bits) obtida de variável de ambiente
 * - IV (Initialization Vector): Gerado aleatoriamente a cada criptografia
 *
 * ⚠️ Requisitos:
 * - Variável de ambiente CRYPTO_SECRET_KEY com exatamente 32 caracteres
 * - A chave deve ser mantida em segredo e nunca versionada no código
 *
 * @example
 * ```typescript
 * import { encrypt, decrypt } from "@/utils/crypto";
 *
 * // Criptografar um código de confirmação
 * const code = "123456";
 * const encrypted = encrypt(code);
 * // Resultado: "a1b2c3d4e5f6....:x7y8z9..."
 *
 * // Descriptografar o código
 * const decrypted = decrypt(encrypted);
 * // Resultado: "123456"
 * ```
 */

// Chave secreta para criptografia (32 bytes = 256 bits)
const SECRET_KEY = env.CRYPTO_SECRET_KEY;
// Algoritmo de criptografia simétrica
const ALGORITHM = "aes-256-cbc";
// Tamanho do vetor de inicialização (16 bytes = 128 bits)
const IV_LENGTH = 16;

// Validação da chave secreta na inicialização do módulo
if (!SECRET_KEY || SECRET_KEY.length !== 32)
  throw new Error(
    "CRYPTO_SECRET_KEY deve estar definida e ter exatamente 32 caracteres.",
  );

/**
 *
 * @param data - String com os dados a serem criptografados
 * @returns String no formato "iv:conteúdo_criptografado" (hexadecimal)
 *
 * @example
 * ```typescript
 * const token = "abc123xyz";
 * const encrypted = encrypt(token);
 * // encrypted = "f3a1b2c4d5e6...:9x7y8z6..."
 * ```
 */
export function encrypt(data: string): string {
  if (!data || typeof data !== "string")
    throw new Error("data deve ser uma string não vazia.");

  try {
    // Gera um IV aleatório para esta operação específica
    const iv = crypto.randomBytes(IV_LENGTH);

    // Cria o cipher com a chave secreta e o IV
    const cipher = crypto.createCipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY),
      iv,
    );

    // Criptografa os dados
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Retorna IV + dados criptografados separados por ":"
    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    throw new Error(
      `Erro ao criptografar dados: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
    );
  }
}

/**
 * Descriptografa dados previamente criptografados pela função encrypt().
 *
 * @param encryptedData - String no formato "iv:conteúdo_criptografado"
 * @returns String com os dados descriptografados (texto original)
 *
 * @example
 * ```typescript
 * const encrypted = "f3a1b2c4d5e6...:9x7y8z6...";
 * const decrypted = decrypt(encrypted);
 * // decrypted = "abc123xyz"
 * ```
 */
export function decrypt(encryptedData: string): string {
  if (!encryptedData || typeof encryptedData !== "string")
    throw new Error("encryptedData deve ser uma string não vazia.");

  // Separa o IV do conteúdo criptografado
  const parts = encryptedData.split(":");

  if (parts.length !== 2)
    throw new Error("encryptedData deve estar no formato 'iv:conteudo'.");

  const [ivHex, encrypted] = parts;

  if (!ivHex || !encrypted)
    throw new Error("encryptedData está incompleto ou corrompido.");

  try {
    // Converte o IV de hexadecimal para Buffer
    const iv = Buffer.from(ivHex, "hex");

    // Valida o tamanho do IV
    if (iv.length !== IV_LENGTH)
      throw new Error(`IV deve ter ${IV_LENGTH} bytes.`);

    // Cria o decipher com a chave secreta e o IV extraído
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(SECRET_KEY),
      iv,
    );

    // Descriptografa os dados
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    throw new Error(
      `Erro ao descriptografar dados: ${error instanceof Error ? error.message : "Dados podem estar corrompidos ou a chave está incorreta"}`,
    );
  }
}
