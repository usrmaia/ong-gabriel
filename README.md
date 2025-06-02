# ONG Gabriel - Plataforma de Atendimento Psicológico

Plataforma de atendimento psicológico para profissionais e pacientes.

Leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir com o projeto.

## Getting Started

Em [.env.example](.env.example) você encontra as variáveis de ambiente necessárias para rodar o projeto. Crie um arquivo `.env` na raiz do projeto e preencha com as informações necessárias.

```bash
# Instale as dependências
npm install
# Inicialize o banco de dados
npx prisma migrate deploy
# Rode o servidor de desenvolvimento
npm run dev
```

Após executar os comandos acima, o servidor de desenvolvimento estará rodando em `http://localhost:3000`.

## Learn More

### Tecnologias Utilizadas

|   [Next.js](https://nextjs.org/)    |  [Prisma](https://www.prisma.io/)  |   [Zod](https://zod.dev/)    |   [Vitest](https://vitest.dev/)    | [Typescript](https://www.typescriptlang.org/) | [Docker](https://hub.docker.com/)  |
| :---------------------------------: | :--------------------------------: | :--------------------------: | :--------------------------------: | :-------------------------------------------: | :--------------------------------: |
| ![Next.js](./docs/icons/nextjs.svg) | ![Prisma](./docs/icons/prisma.svg) | ![Zod](./docs/icons/zod.svg) | ![Vitest](./docs/icons/vitest.svg) |  ![Typescript](./docs/icons/typescript.svg)   | ![Docker](./docs/icons/docker.svg) |

### Documentação Adicional

- [Guia de Commits Convencionais](docs/conventional-commits.md)
- [Guia de Git Flow](docs/gitflow.md)
- [Guia de Versionamento Semântico](docs/semantic-versioning.md)
