# API de Tarefas e Livros — IPPD

Projeto acadêmico desenvolvido para a atividade prática da disciplina **Introdução à Programação Paralela e Distribuída**.

A aplicação disponibiliza uma API REST construída com NestJS. Os módulos `tasks` e `books` implementam operações CRUD e armazenam os registros em arquivos JSON locais.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução

```bash
npm install
npm run start:dev
```

A API fica disponível em `http://localhost:3000`.

Para gerar a versão de produção:

```bash
npm run build
npm run start:prod
```

## Rotas

### Tasks

| Método | Rota | Descrição |
|---|---|---|
| GET | `/tasks` | Lista tarefas |
| GET | `/tasks/:id` | Consulta uma tarefa |
| POST | `/tasks` | Cria uma tarefa |
| PUT | `/tasks/:id` | Substitui os dados de uma tarefa |
| PATCH | `/tasks/:id` | Atualiza parcialmente uma tarefa |
| DELETE | `/tasks/:id` | Remove uma tarefa |

Exemplo de criação:

```json
{
  "title": "Estudar NestJS",
  "description": "Implementar uma API REST",
  "completed": false
}
```

### Books

| Método | Rota | Descrição |
|---|---|---|
| GET | `/books` | Lista livros |
| GET | `/books/:id` | Consulta um livro |
| POST | `/books` | Cadastra um livro |
| PUT | `/books/:id` | Substitui os dados de um livro |
| PATCH | `/books/:id` | Atualiza parcialmente um livro |
| DELETE | `/books/:id` | Remove um livro |

Exemplo de cadastro:

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publishedYear": 2008,
  "read": false
}
```

## Persistência

Os dados são gravados nos arquivos `data/tasks.json` e `data/books.json`. O diretório e os arquivos são criados automaticamente na primeira execução. Como os dados ficam no disco, permanecem disponíveis após reiniciar o servidor.

O diretório `data/` é ignorado pelo Git para que dados locais de execução não sejam publicados no repositório.

## Validação manual das rotas

Com o servidor em execução, as rotas podem ser verificadas com ferramentas como Postman, Insomnia ou `curl`. Exemplo:

```bash
curl http://localhost:3000/tasks
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar NestJS","completed":false}'
curl http://localhost:3000/books
```

Para verificar a persistência, crie registros, encerre o servidor, inicie-o novamente e consulte as mesmas rotas.

> **Estado dos testes:** este repositório contém a implementação e as instruções de verificação. Os testes de execução e persistência ainda precisam ser realizados no ambiente local antes da entrega final.
