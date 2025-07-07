/**
 * Extrai parâmetros de consulta de uma URL ou objeto Request e os retorna como um registro de chave-valor.
 *
 * @param source - A fonte da qual extrair os parâmetros. Pode ser uma string de URL ou um objeto Request.
 * @returns Um registro onde cada chave é um nome de parâmetro e cada valor é o valor correspondente do parâmetro.
 */
export const getParams = (source: string | Request) => {
  const url = typeof source === "string" ? source : source.url;
  const queryString = url.split("?")[1]?.split("#")[0];
  const queryParams = Object.fromEntries(new URLSearchParams(queryString));
  return queryParams;
};
