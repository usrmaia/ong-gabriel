import { describe, it, expect } from "vitest";
import { getParams } from "@/utils/params";

describe("getParams", () => {
  it("deve retornar um objeto vazio se não houver parâmetros de consulta", () => {
    expect(getParams("https://example.com")).toEqual({});
    expect(getParams("https://example.com/path")).toEqual({});
  });

  it("deve analisar um único parâmetro de consulta", () => {
    expect(getParams("https://example.com?foo=bar")).toEqual({ foo: "bar" });
  });

  it("deve analisar vários parâmetros de consulta", () => {
    expect(getParams("https://example.com?foo=bar&baz=qux")).toEqual({
      foo: "bar",
      baz: "qux",
    });
  });

  it("deve decodificar parâmetros codificados em URL", () => {
    expect(
      getParams("https://example.com?name=John%20Doe&city=New%20York"),
    ).toEqual({
      name: "John Doe",
      city: "New York",
    });
  });

  it("deve lidar com parâmetros com espaços", () => {
    expect(
      getParams("https://example.com?name=John Doe&city=New York"),
    ).toEqual({
      name: "John Doe",
      city: "New York",
    });
  });

  it("deve lidar com parâmetros sem valores", () => {
    expect(getParams("https://example.com?foo=&bar=baz")).toEqual({
      foo: "",
      bar: "baz",
    });
  });

  it("deve lidar com URLs com fragmentos", () => {
    expect(getParams("https://example.com?foo=bar#section")).toEqual({
      foo: "bar",
    });
  });

  it("deve lidar com parâmetros repetidos (o último vence)", () => {
    expect(getParams("https://example.com?foo=bar&foo=baz")).toEqual({
      foo: "baz",
    });
  });

  it("deve lidar com URLs com apenas um ponto de interrogação", () => {
    expect(getParams("https://example.com?")).toEqual({});
  });

  it("deve analisar parâmetros de consulta de um objeto Request", () => {
    const req = { url: "https://example.com?foo=bar&baz=qux" } as Request;
    expect(getParams(req)).toEqual({ foo: "bar", baz: "qux" });
  });

  it("deve retornar um objeto vazio para Request sem parâmetros", () => {
    const req = { url: "https://example.com/path" } as Request;
    expect(getParams(req)).toEqual({});
  });

  it("deve lidar com Request contendo fragmentos", () => {
    const req = { url: "https://example.com?foo=bar#fragment" } as Request;
    expect(getParams(req)).toEqual({ foo: "bar" });
  });

  it("deve lidar com Request com parâmetros repetidos (último vence)", () => {
    const req = { url: "https://example.com?foo=bar&foo=baz" } as Request;
    expect(getParams(req)).toEqual({ foo: "baz" });
  });
});
