# Docs_Mds — Doc Architect (Web & Spec-Driven)

Uma aplicação web SPA estática (pronta para o **GitHub Pages**) e ecossistema spec-driven que gera toda a documentação que agentes de IA e desenvolvedores precisam, seguindo a metodologia rigorosa do **Kiro**:

```
Ideia  →  Context.md  →  Spec.md  →  Plan.md  →  (código feito por outro agente)
           (steering)    (requisitos)  (design + tarefas)
                 └──────────── AGENTS.md / CLAUDE.md (regras permanentes) ───┘
```

---

## Destaques

- **100% Gratuito & Rápido:** Integração direta com **Groq** (`llama-3.3-70b-versatile` com centenas de tokens/segundo) e **OpenRouter** (modelos com cota `:free` como DeepSeek R1 e Llama 3.3).
- **Portabilidade Total:** Funciona em qualquer computador direto pelo navegador via **GitHub Pages**. Sem dependência de servidor, Node ou Python na máquina do usuário.
- **Segurança BYOK (*Bring Your Own Key*):** Sua chave de API fica armazenada exclusivamente no `localStorage` do seu navegador. Nenhuma chave transita por servidores intermediários.
- **Padrão Kiro & EARS:** Histórias de usuário, critérios de aceite formais em sintaxe **EARS** (`WHEN`, `IF-THEN`, `WHILE`, `WHERE`, `THE sistema SHALL`), e tarefas atômicas numeradas com `_Requisitos: Rx.y_`.
- **Renderização Visual de Mermaid:** Renderiza na hora os fluxogramas e diagramas de sequência de arquitetura.
- **Exportação em 1 Clique:** Baixa um arquivo `.zip` com a estrutura completa de pastas pronta para colocar no seu projeto.

---

## Equivalência com o Kiro

| Arquivo Gerado | Equivalente no Kiro | Para que serve |
|---|---|---|
| `docs/Context.md` | `.kiro/steering/product.md`, `tech.md`, `structure.md` | O que é o produto, a stack e a organização. Vale para todas as features |
| `docs/specs/<feature>/Spec.md` | `.kiro/specs/<feature>/requirements.md` | Histórias de usuário e critérios de aceite em **EARS** |
| `docs/specs/<feature>/Plan.md` | `.kiro/specs/<feature>/design.md` + `tasks.md` | Arquitetura (Mermaid) e tarefas pequenas, numeradas e rastreáveis |
| `AGENTS.md` | Steering com `inclusion: always` | Regras universais para qualquer agente (Claude, Codex, Cursor, Copilot, Kiro…) |
| `CLAUDE.md` | Steering com `inclusion: always` | Regras específicas do Claude Code; importa `@AGENTS.md` e `@docs/Context.md` |

---

## Estrutura do Projeto

```
Docs_Mds/
├── index.html                   ← Interface Web SPA (GitHub Pages)
├── css/
│   └── styles.css               ← Estilização complementar e tema escuro
├── js/
│   ├── app.js                   ← Controlador do Wizard das 4 fases
│   ├── config.js                ← Provedores e modelos (Groq e OpenRouter)
│   ├── api.js                   ← Cliente REST com chamadas diretas
│   ├── prompts.js               ← Orquestrador dos prompts EARS e Kiro
│   └── export.js                ← Gerador do pacote .ZIP e cópia rápida
├── templates/                   ← Modelos canônicos de referência
│   ├── Context.md
│   ├── Spec.md
│   ├── Plan.md
│   ├── AGENTS.md
│   └── CLAUDE.md
├── specs/doc-architect/         ← Especificação do próprio projeto
│   ├── requirements.md          ← Requisitos em EARS
│   ├── design.md                ← Design técnico e arquitetura
│   └── tasks.md                 ← Tarefas de implementação
├── .claude/agents/
│   └── doc-architect.md         ← Prompt do subagente para quem usar no Claude Code
└── README.md                    ← Documentação e guia de uso
```

---

## Como Usar

### Opção 1: Via GitHub Pages (Em qualquer computador)
1. Suba este repositório para o seu GitHub.
2. No repositório, vá em **Settings &rarr; Pages**.
3. Em **Source**, selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
4. Clique em **Save**. Em instantes, seu link estará ativo (ex.: `https://seu-usuario.github.io/Docs_Mds/`).
5. Abra no computador do trabalho, de casa ou em qualquer dispositivo, insira sua chave gratuita do Groq ou OpenRouter e gere suas especificações!

### Opção 2: Rodando Localmente
Como é uma SPA moderna com ES Modules, basta iniciar qualquer servidor estático local:

Com **Python**:
```bash
python -m http.server 8080
```
Ou com **Node.js**:
```bash
npx serve .
```
E acesse `http://localhost:8080`.

---

## Fluxo das 4 Fases

1. **Fase 1 (Context):** Descreva seu produto, público e tecnologias. A IA gera o `Context.md` marcando incógnitas como `TBD`. Você revisa e aprova.
2. **Fase 2 (Spec):** Dê um nome em *kebab-case* para a feature e descreva as regras. A IA gera a `Spec.md` com histórias e critérios de aceite em sintaxe formal EARS.
3. **Fase 3 (Plan):** A IA gera o plano técnico com diagramas visuais Mermaid (arquitetura e sequência) e tarefas para um commit cada.
4. **Fase 4 (Regras & Exportação):** O sistema cria o `AGENTS.md` e o `CLAUDE.md`. Você pode copiar qualquer documento ou clicar em **"Baixar Pacote .ZIP"** para extrair direto na raiz do seu projeto.
