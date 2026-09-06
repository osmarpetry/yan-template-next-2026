# AGENT.md

Notas para retomar trabalho de automação/agentes neste repo.

## Migração de major versions (Dependabot) — 2026-09-06

Escopo: migrar PRs abertos do Dependabot com bump de MAJOR version.

### Resultado: nada a fazer

Único PR aberto do Dependabot é o **#1** ("Bump the npm group across 1
directory with 23 updates", branch `dependabot/npm_and_yarn/npm-5e808cadaa`).
Conferi cada bump do grupo: `@ariakit/react` 0.4.26→0.4.39, `next`
16.2.2→16.3.4, `react` 19.2.4→19.2.8, `@types/react` 19.2.14→19.2.18,
`react-dom` 19.2.4→19.2.8, `@types/react-dom` 19.2.3→19.2.7, `tailwind-merge`
3.5.0→3.6.0, `zod` 4.3.6→4.5.4. Nenhum cruza fronteira de MAJOR (todos
minor/patch). Não é escopo desta tarefa — não toquei no PR, deixei pro
automerge padrão do CI (`osmarpetry/.github` node.yml) cuidar quando passar.

### Observação (não relacionada à tarefa)

A working tree do `main` já estava suja com um WIP grande (feature de
`jobs`, vários arquivos em `src/features/jobs`, `tests/e2e`,
`tests/integration`, `tests/unit`) quando cheguei. Não toquei em nada disso,
só adicionei este arquivo. Se for retomar a migração de dependências aqui,
`git status` antes de mexer — pode ainda estar sujo.

### Próximos passos se retomar

- Nenhuma migração de major pendente até a próxima leva de PRs do Dependabot.
- Se o Dependabot abrir um PR de major isolado (fora do grupo `npm`), aplicar
  a mesma metodologia: fetch da branch, instalar, migrar, rodar CI local,
  commit, push, merge manual se o automerge não disparar sozinho (actor do
  push precisa ser `dependabot[bot]` pro job de automerge do node.yml rodar).
