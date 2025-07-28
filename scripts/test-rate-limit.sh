#!/bin/bash
# Script para testar rate limiting manualmente

echo "🧪 Testando Rate Limiting da Aplicação"
echo "======================================="

# URL base da aplicação
BASE_URL="http://localhost:3000"

# Testa API de health (sem rate limiting)
echo "1. Testando endpoint sem rate limiting (health):"
for i in {1..5}; do
  response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/api/health")
  echo "  Requisição $i: HTTP $response"
done

echo ""

# Testa API com rate limiting (user - requer autenticação)
echo "2. Testando endpoint com rate limiting (simulação):"
echo "   (Este endpoint requer autenticação, então retornará 401/403)"

for i in {1..10}; do
  response=$(curl -s -w "HTTP: %{http_code} | Rate-Limit-Remaining: %header{X-RateLimit-Remaining}" -o /dev/null "$BASE_URL/api/user")
  echo "  Requisição $i: $response"
  sleep 0.5
done

echo ""
echo "📝 Notas:"
echo "- Endpoints protegidos redirecionam para login quando não autenticado"
echo "- Headers de rate limit são incluídos em todas as respostas"
echo "- Para testar completamente, é necessário estar autenticado"
echo ""
echo "🔍 Para ver headers completos, use:"
echo "curl -I $BASE_URL/api/health"
