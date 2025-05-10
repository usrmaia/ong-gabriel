# Conventional Commits

O **Conventional Commits** é um padrão para mensagens de commit que facilita a leitura.

## 📌 Estrutura da Mensagem de Commit

`<tipo>[escopo]: <descrição>`

* **tipo**: define a natureza da mudança (obrigatório).
* **escopo**: área afetada no código.
* **descrição**: resumo breve da alteração (obrigatório). Geralmente, é o titulo da task.
* **corpo**: detalhes adicionais sobre a mudança.
* **rodapé**: informações como mudanças incompatíveis ou referências a issues.

## 🧩 Tipos Comuns de Commit

* **feat**: introduz uma nova funcionalidade.
* **fix**: corrige um bug.
* **docs**: alterações na documentação.
* **style**: mudanças que não afetam o significado do código (regra de negócio).
* **refactor**: alterações no código que não corrigem bugs nem adicionam funcionalidades.
* **perf**: melhorias de desempenho.
* **test**: adição ou modificação de testes.
* **chore**: atualizações de tarefas de build ou ferramentas auxiliares.
* **ci**: mudanças em arquivos e scripts de configuração de integração contínua.

## 🧪 Exemplos de Mensagens de Commit

* Adição de funcionalidade: `feat: adicionar suporte a login`
* Correção de bug: `fix: corrigir erro de validação no formulário`
* Atualização de documentação: `docs: atualizar README com instruções de instalação`

## Integração com Ferramentas de Gestão (Jira)
`<tipo>[escopo]: <key-jira> <descrição>`
* **key-jira**: chave da tarefa no Jira (ex: `PROJ-123`).
* **exemplo**: `feat[login]: PROJ-123 adicionar suporte a login`

## Fontes
- [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/)
- [Vozes da Minha Cabeça]()