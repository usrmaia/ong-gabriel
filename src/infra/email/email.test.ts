import { describe, it, expect } from "vitest";
import { applyHtmlTemplate } from "./email";

describe("applyHtmlTemplate", () => {
  it("substitui uma variável no HTML", () => {
    const html = "<p>Hello, {{name}}!</p>";
    const context = { name: "George" };
    const result = applyHtmlTemplate(html, context);
    expect(result).toBe("<p>Hello, George!</p>");
  });

  it("substitui várias variáveis no HTML", () => {
    const html = "<p>{{greeting}}, {{name}}!</p>";
    const context = { greeting: "Hi", name: "Alice" };
    const result = applyHtmlTemplate(html, context);
    expect(result).toBe("<p>Hi, Alice!</p>");
  });

  it("substitui várias ocorrências da mesma variável", () => {
    const html = "<p>{{word}} {{word}} {{word}}</p>";
    const context = { word: "Echo" };
    const result = applyHtmlTemplate(html, context);
    expect(result).toBe("<p>Echo Echo Echo</p>");
  });

  it("retorna o HTML original se não houver variáveis", () => {
    const html = "<p>Hello, {{name}}!</p>";
    const result = applyHtmlTemplate(html);
    expect(result).toBe(html);
  });

  it("retorna o HTML original se o contexto estiver vazio", () => {
    const html = "<p>Hello, {{name}}!</p>";
    const result = applyHtmlTemplate(html, {});
    expect(result).toBe(html);
  });

  it("ignora variáveis não definidas no contexto", () => {
    const html = "<p>Hello, {{name}}! Your code is {{code}}.</p>";
    const context = { name: "Bob" };
    const result = applyHtmlTemplate(html, context);
    expect(result).toBe("<p>Hello, Bob! Your code is {{code}}.</p>");
  });

  it("funciona sem variáveis no HTML", () => {
    const html = "<p>Hello, world!</p>";
    const context = { name: "Bob" };
    const result = applyHtmlTemplate(html, context);
    expect(result).toBe(html);
  });
});
