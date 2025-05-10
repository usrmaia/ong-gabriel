# Gitflow

No modelo padrão de desenvolvimento, o código é desenvolvido diretamente na branch develop. Considerando que, nem sempre, o código está pronto para ser lançado, necessitando de ajustes e correções, uma única task pode gerar vários commits e um bug desenvolvido por um programador pode gerar atrasos para outro programador. Ao fim, quando o código é liberado, a task pode conter mais de um commit, o que pode dificultar a identificação do que foi feito.

## O que é o Gitflow?

O Gitflow é um modelo de branching para Git que ajuda a organizar o desenvolvimento de software. Ele define um conjunto de regras e convenções para criar branches, fazer merges e versionar o código. Nele, o desenvolvimento é dividido em várias branches, cada uma com um propósito específico. 

**Ao iniciar uma nova task, o desenvolvedor cria uma nova branch a partir da branch develop. O código é desenvolvido, revisado e aprovado nessa nova branch. Quando a task é concluída, a branch é mesclada de volta à branch develop. Isso permite que várias tarefas sejam desenvolvidas simultaneamente, sem interferir no trabalho de outros desenvolvedores.**

Para o caso de tasks longas, o Gitflow permite manter as branches atualizadas com a branch master/develop, evitando conflitos e garantindo que o código esteja sempre atualizado.

O Gitflow tem mais branches do que o modelo padrão de desenvolvimento. Ele inclui, geralmente, as branches:

```bash
    feature  # Novas funcionalidades.
    bugfix   # Correções de bugs.
    release  # Preparação para o lançamento.
    hotfix   # Correções rápidas.
    support  # Suporte a versões anteriores.
```

![Gitflow - Exemplo de branches](https://wac-cdn.atlassian.com/dam/jcr:34c86360-8dea-4be4-92f7-6597d4d5bfae/02%20Feature%20branches.svg?cdnVersion=2710)

## Tutorial

Qualquer programa pode ser utilizado para criar o fluxo de trabalho do Gitflow, inclusive o `git` ou o `GitHub Desktop`. Mas aqui, vamos utilizar o `git flow`, que é um programa que facilita o uso do Gitflow. Para instalar o `git flow`, utilize o seguinte comando:

```bash
apt install git-flow
```

### Criando uma feature

Para criar uma nova feature, utilize o seguinte comando:

```bash
git flow feature <command> <name-branch> <base-branch> --showcommands
```

Onde <command> é um dos seguintes:

```bash
    git flow feature start      # Inicia uma nova feature.
    git flow feature finish     # Finaliza uma feature. 
    git flow feature publish    # Publica uma feature. O padrão é branch atual.
    git flow feature track      # Rastreia uma feature.
    git flow feature diff       # Mostra as diferenças de uma feature.
    git flow feature rebase     # Rebase de uma feature.
    git flow feature checkout   # Faz checkout de uma feature.
    git flow feature pull       # Faz pull de uma feature.
    git flow feature delete     # Deleta uma feature.
```

E <name-branch> é o nome da branch que você deseja criar.
E <base-branch> é a branch a partir da qual você deseja criar a nova branch. O padrão é `develop`.

Por exemplo, para criar uma nova feature chamada `minha-feature`, a partir da branch `develop`, utilize o seguinte comando:

```bash
git flow feature start minha-feature develop --showcommands
```

Agora, basta fazer a sua tarefa normalmente. Quando a tarefa estiver concluída, faça commit e publique a branch para o repositório remoto:

```bash
git flow feature publish minha-feature
```

## Fonte
- [Atlassian - Saiba tudo sobre o Gitflow Workflow](https://www.atlassian.com/br/git/tutorials/comparing-workflows/gitflow-workflow)
- [Vozes da Minha Cabeça]()