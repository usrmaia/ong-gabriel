# Versionamento Semântico (SemVer)

## O que é o Versionamento Semântico?

O Versionamento Semântico (SemVer) é um conjunto de regras e requisitos que definem como os números de versão são atribuídos e incrementados em um software. Essas regras são baseadas em práticas comuns já utilizadas em softwares de código aberto e fechado.

## Formato Básico

O formato de um número de versão no SemVer é: **MAJOR.MINOR.PATCH** (X.Y.Z)

Exemplo: 2.4.1

## Regras de Incremento

1. **MAJOR (X)** - Quando fizer mudanças incompatíveis na API

   - Alterações que quebram compatibilidade com versões anteriores
   - As versões MINOR e PATCH são reiniciadas para 0 quando MAJOR é incrementado

2. **MINOR (Y)** - Quando adicionar funcionalidades mantendo compatibilidade

   - Novas funcionalidades que não quebram a compatibilidade com versões anteriores
   - Quando marcar funcionalidades como obsoletas (deprecated)
   - A versão PATCH é reiniciada para 0 quando MINOR é incrementado

3. **PATCH (Z)** - Quando fizer correções de bugs mantendo compatibilidade
   - Correções de bugs que não afetam a API pública

## Identificadores adicionais

### Pré-lançamento

Pode-se denotar uma versão de pré-lançamento adicionando um hífen e uma série de identificadores separados por ponto após a versão PATCH:

```
1.0.0-alpha < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0 < 2.0.0
```

Versões de pré-lançamento têm precedência menor que a versão normal associada.

Para mais informações, consulte [semver.org](https://semver.org/)
