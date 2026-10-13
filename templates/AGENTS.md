# AGENTS.md

> Regras para **qualquer** agente de IA que trabalhe neste repositório (Claude Code, Codex, Cursor, Copilot e outros agentes).
> Curto e objetivo. Detalhes do produto ficam em `docs/Context.md`.

## Projeto
{{uma frase}} — veja `docs/Context.md`.

## Comandos
```bash
{{instalar}}      # ex.: npm install
{{rodar}}         # ex.: npm run dev
{{testar}}        # ex.: npm test
{{lint}}          # ex.: npm run lint
```

## Fluxo de trabalho (spec-driven)
1. Leia `docs/Context.md`.
2. Para uma feature nova, existe `docs/specs/<feature>/Spec.md` aprovada? Se não houver, **pare e peça**.
3. Siga `docs/specs/<feature>/Plan.md` **uma tarefa por vez**, marcando `[x]` ao terminar.
4. Toda mudança precisa atender a um critério EARS da Spec.

## Estilo de código
- {{ex.: TypeScript strict; sem `any`}}
- {{ex.: funções pequenas; nomes em inglês}}

## Testes
- {{framework}}; todo critério de aceite vira teste.
- Não marque uma tarefa como concluída com testes falhando.

## Limites (não faça)
- Não altere {{arquivos/pastas sensíveis}} sem pedir.
- Não adicione dependências sem justificar no Plan.md.
- Não faça commit de segredos (`.env`, chaves).

## Git
- Commits: {{ex.: Conventional Commits — feat:, fix:, docs:}}
- Branch por feature: `feat/<feature>`.
