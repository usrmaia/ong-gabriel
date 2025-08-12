import { describe, it, expect } from "vitest";
import { applyTemplate } from "@/infra/email/template";

describe("applyTemplate", () => {
  it("substitui uma variável do template", () => {
    const template = "<p>Hello, {{name}}!</p>";
    const context = { name: "George" };
    const result = applyTemplate(template, context);
    expect(result).toBe("<p>Hello, George!</p>");
  });

  it("substitui várias variáveis do template", () => {
    const template = "<p>{{greeting}}, {{name}}!</p>";
    const context = { greeting: "Hi", name: "Alice" };
    const result = applyTemplate(template, context);
    expect(result).toBe("<p>Hi, Alice!</p>");
  });

  it("substitui várias ocorrências da mesma variável", () => {
    const template = "<p>{{word}} {{word}} {{word}}</p>";
    const context = { word: "Echo" };
    const result = applyTemplate(template, context);
    expect(result).toBe("<p>Echo Echo Echo</p>");
  });

  it("retorna o template original se o contexto estiver indefinido", () => {
    const template = "<p>Hello, {{name}}!</p>";
    const result = applyTemplate(template);
    expect(result).toBe(template);
  });

  it("retorna o template original se o contexto estiver vazio", () => {
    const template = "<p>Hello, {{name}}!</p>";
    const result = applyTemplate(template, {});
    expect(result).toBe(template);
  });

  it("ignora variáveis não definidas no contexto", () => {
    const template = "<p>Hello, {{name}}! Your code is {{code}}.</p>";
    const context = { name: "Bob" };
    const result = applyTemplate(template, context);
    expect(result).toBe("<p>Hello, Bob! Your code is {{code}}.</p>");
  });

  it("funciona sem variáveis no template", () => {
    const template = "<p>Hello, world!</p>";
    const context = { name: "Bob" };
    const result = applyTemplate(template, context);
    expect(result).toBe(template);
  });
});
