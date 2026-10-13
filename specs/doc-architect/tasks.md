# Tasks — Doc Architect (Web & Spec-Driven)

> Cada tarefa cita os requisitos que atende. Marque `[x]` quando concluir.

- [x] 1. Atualizar especificação do projeto para arquitetura Web SPA — `requirements.md` e `design.md` — _Requisitos: R5, R6_
- [x] 2. Estrutura base da interface Web (SPA)
  - [x] 2.1 Criar `index.html` com layout responsivo moderno, painel de etapas (Wizard) e CDNs necessárias (Tailwind, Marked, Mermaid, JSZip) — _Requisitos: R6.1, R8.1_
  - [x] 2.2 Implementar painel de configuração de API Keys com seleção de provedor (Groq / OpenRouter) e persistência em `localStorage` — _Requisitos: R7.1, R7.2_
- [x] 3. Conector de APIs de IA (Groq e OpenRouter)
  - [x] 3.1 Criar `js/config.js` com lista de modelos recomendados (Llama 3.3 70B, modelos :free do OpenRouter) — _Requisitos: R7.3_
  - [x] 3.2 Criar `js/api.js` com cliente HTTP REST, tratamento de cabeçalhos de autorização e tratamento de erros amigável (401, 429) — _Requisitos: R7.4_
- [x] 4. Orquestrador de Prompts Spec-Driven
  - [x] 4.1 Criar `js/prompts.js` com os prompts baseados estritamente nos templates do repositório — _Requisitos: R1, R2, R3, R4_
  - [x] 4.2 Garantir regras de sintaxe EARS para a Spec e regras de diagramas Mermaid + tarefas atômicas para o Plan — _Requisitos: R2.2, R3.3, R3.4_
- [x] 5. Controlador de Fases e Gates de Aprovação
  - [x] 5.1 Implementar controle de estado e avanço sequencial (Fase 1: Context → Fase 2: Spec → Fase 3: Plan → Fase 4: Regras) — _Requisitos: R5.1, R5.2_
  - [x] 5.2 Adicionar alternador de abas ("Visualização Renderizada" e "Editar Markdown") para cada documento gerado — _Requisitos: R5.2, R8.1_
  - [x] 5.3 Implementar renderização dinâmica de diagramas Mermaid com fallback seguro — _Requisitos: R8.2_
- [x] 6. Módulo de Exportação
  - [x] 6.1 Implementar botão de cópia de Markdown individual com feedback visual — _Requisitos: R9.1_
  - [x] 6.2 Criar `js/export.js` usando JSZip para empacotar e baixar a árvore completa de pastas (`docs/Context.md`, `docs/specs/...`, `AGENTS.md`, `CLAUDE.md`) — _Requisitos: R9.2_
- [x] 7. Validação e Documentação
  - [x] 7.1 Testar localmente a integridade dos arquivos e sintaxe ES Modules — _Requisitos: R1–R9_
  - [x] 7.2 Atualizar `README.md` com instruções claras de uso e como ativar no GitHub Pages com 1 clique — _Requisitos: R6.1_
