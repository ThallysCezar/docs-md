# Docs_Mds — Doc Architect (Web & Spec-Driven)

Uma aplicação web SPA estática (pronta para o **GitHub Pages**) e ecossistema que gera toda a documentação que agentes de IA e desenvolvedores precisam, fundamentada em sólidas referências de engenharia de software e na metodologia **Spec-Driven Development (SDD)**:

```
Ideia  →  Context.md  →  Spec.md  →  Plan.md  →  (código feito por outro agente)
           (steering)    (requisitos)  (design + tarefas)
                 └──────────── AGENTS.md / CLAUDE.md (regras permanentes) ───┘
```

---

## Destaques

- **100% Gratuito & Rápido:** Integração direta com **Groq** (`llama-3.3-70b-versatile` com centenas de tokens/segundo) e **OpenRouter** (modelos com cota `:free` como DeepSeek R1 e Llama 3.3).
- **Portabilidade Total:** Funciona em qualquer computador direto pelo navegador via **GitHub Pages**. Sem necessidade de instalar servidores, Node.js ou Python na máquina do usuário.
- **Segurança BYOK (*Bring Your Own Key*):** Sua chave de API fica armazenada exclusivamente no `localStorage` do seu navegador. Nenhuma chave transita por servidores intermediários.
- **Requisitos Formais em EARS:** Histórias de usuário e critérios de aceite estruturados na sintaxe formal **EARS** (*Easy Approach to Requirements Syntax*: `WHEN`, `IF-THEN`, `WHILE`, `WHERE`, `THE sistema SHALL`).
- **Design Técnico & Tarefas Atômicas:** Arquitetura com diagramas Mermaid visuais (fluxogramas e sequências) e lista de tarefas pequenas rastreáveis (`_Requisitos: Rx.y_`), dimensionadas para um commit cada.
- **Exportação em 1 Clique:** Baixa um arquivo `.zip` com a árvore de pastas completa pronta para o seu projeto.

---

## Arquitetura dos Documentos Gerados

| Arquivo Gerado | Papel na Metodologia | Para que serve |
|---|---|---|
| `docs/Context.md` | *Steering Global* | Visão do produto, tecnologias adotadas, estrutura de pastas e decisões de arquitetura (ADRs). Guia todas as features. |
| `docs/specs/<feature>/Spec.md` | *Especificação Funcional* | Histórias de usuário, critérios de aceite formais em **EARS**, escopo delimitado e perguntas em aberto. |
| `docs/specs/<feature>/Plan.md` | *Design Técnico & Checklist* | Arquitetura visual (Mermaid), contratos, modelo de dados, tratamento de erros e checklist de tarefas atômicas numeradas. |
| `AGENTS.md` | *Diretrizes Universais* | Fonte única de regras para qualquer agente de IA (Claude Code, Codex, Cursor, Copilot e outros). |
| `CLAUDE.md` | *Configuração de Ambiente* | Importa `@AGENTS.md` e `@docs/Context.md`, com orientações concisas de execução. |

---

## Tutorial: Como Obter Chaves de API Gratuitas

O Doc Architect foi planejado para funcionar com custo zero utilizando provedores de IA que oferecem cotas gratuitas generosas.

### Opção 1: Groq (Recomendado — Ultrarrápido)
O Groq oferece execução em hardware LPU de altíssima velocidade (centenas de tokens por segundo) com modelos como o **Llama 3.3 70B** totalmente gratuitos.

1. Acesse o console do Groq: [console.groq.com](https://console.groq.com).
2. Clique em **Sign Up** ou faça login diretamente com sua conta **Google** ou **GitHub**.
3. No menu lateral esquerdo, clique em **API Keys** (ou acesse direto [console.groq.com/keys](https://console.groq.com/keys)).
4. Clique no botão **Create API Key**.
5. Dê um nome para a chave (por exemplo: `DocArchitect`) e clique em **Submit**.
6. **Copie a chave gerada** (ela começa com `gsk_...`). Guarde-a em local seguro pois ela só é exibida uma vez.
7. Abra a aplicação Doc Architect, clique em **Configurar IA**, selecione o provedor **Groq**, cole sua chave e clique em **Salvar e Continuar**.

---

### Opção 2: OpenRouter (Múltiplos Modelos Abertos Gratuitos)
O OpenRouter agrega diversos modelos de IA e disponibiliza vários modelos abertos com cota gratuita diária (sufixo `:free`).

1. Acesse o portal do OpenRouter: [openrouter.ai](https://openrouter.ai).
2. No canto superior direito, clique em **Sign In** e autentique-se com sua conta Google, GitHub ou e-mail.
3. No menu, navegue até a seção de chaves: [openrouter.ai/keys](https://openrouter.ai/keys).
4. Clique no botão **Create Key**.
5. Atribua um nome (ex.: `DocArchitect`), mantenha o limite de crédito padrão e clique em **Create**.
6. **Copie a chave gerada** (ela começa com `sk-or-...`).
7. Na aplicação Doc Architect, clique em **Configurar IA**, escolha o provedor **OpenRouter**, cole sua chave e selecione qualquer modelo com a marcação **(Free)** (ex.: *Llama 3.3 70B Free* ou *DeepSeek R1 Free*).

> **Aviso de Privacidade:** Sua chave é gravada estritamente no armazenamento local (`localStorage`) do seu navegador naquela máquina. Nenhuma chave é transmitida para nenhum backend próprio ou repositório.

---

## Como Publicar no GitHub Pages

A aplicação foi desenvolvida como uma SPA estática independente, ideal para deploy gratuito no **GitHub Pages**:

1. Crie um repositório no seu GitHub.
2. No seu computador, suba os arquivos desta pasta para o repositório:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release doc-architect"
   git branch -M main
   git remote add origin https://github.com/<SEU-USUARIO>/Docs_Mds.git
   git push -u origin main
   ```
3. No GitHub, abra o repositório e vá na aba **Settings &rarr; Pages**.
4. Em **Build and deployment &rarr; Source**, escolha **Deploy from a branch**.
5. Em **Branch**, selecione `main` (ou `master`) e a pasta `/ (root)`. Clique em **Save**.
6. Em cerca de 1 a 2 minutos, o GitHub exibirá o link da sua aplicação publicada (ex.: `https://<seu-usuario>.github.io/Docs_Mds/`).
7. Você poderá acessar essa URL de qualquer computador pessoal ou de trabalho, bastando colar sua chave gratuita para gerar suas especificações.

---

## Como Rodar Localmente

Se preferir rodar localmente no seu computador antes de subir:

Com **Python**:
```bash
python -m http.server 8080
```
Ou com **Node.js**:
```bash
npx serve .
```
E acesse `http://localhost:8080` no navegador.

---

## Fluxo das 4 Fases

1. **Fase 1 (Context):** Forneça o nome do projeto, o problema que ele resolve e a stack pretendida. A IA preenche as seções do `Context.md` e marca dúvidas como `TBD`. Você revisa, edita se quiser e clica em aprovar.
2. **Fase 2 (Spec):** Defina o nome e os comportamentos da feature. A IA estrutura histórias de usuário e critérios formais no padrão **EARS**, além de delimitar o que está fora de escopo.
3. **Fase 3 (Plan):** A IA gera o plano técnico completo com **diagramas visuais Mermaid** (arquitetura e sequência) e um checklist de tarefas atômicas vinculadas aos requisitos (`_Requisitos: Rx.y_`).
4. **Fase 4 (Regras & Exportação):** Gera `AGENTS.md` e `CLAUDE.md`. Você pode copiar arquivos individuais ou clicar em **"Baixar Pacote .ZIP"** para extrair a estrutura pronta no seu projeto.
