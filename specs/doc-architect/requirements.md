# Requirements — Doc Architect (Web & Spec-Driven)

> Formato Spec-Driven: histórias de usuário + critérios de aceite em **EARS**
> (`WHEN <gatilho> THE <sistema> SHALL <resposta>` / `IF <condição> THEN …` / `WHILE <estado> …`).

## Introdução

O **Doc Architect** é uma aplicação web SPA (Single Page Application) estática, executável diretamente via **GitHub Pages**, que orienta desenvolvedores a gerarem a documentação completa no padrão **spec-driven** (`Context.md`, `Spec.md`, `Plan.md`, `AGENTS.md` e `CLAUDE.md`). A aplicação utiliza modelos de IA gratuitos ou de baixo custo através das APIs do **Groq** e **OpenRouter**, mantendo as chaves privadas do usuário no navegador e oferecendo aprovação por fases e visualização em tempo real de diagramas Mermaid.

---

### R1 — Gerar Context.md (steering do produto)
**Como** desenvolvedor, **quero** gerar o contexto global do produto **para que** qualquer agente de IA ou desenvolvedor entenda o propósito, tecnologias e estrutura do projeto.

1. WHEN o usuário descrever seu projeto ou colar informações de manifestos THE sistema SHALL gerar o `Context.md` baseado no modelo do projeto.
2. THE sistema SHALL dividir o `Context.md` em seções padronizadas: Produto, Tecnologia, Estrutura, Glossário e Decisões Importantes.
3. IF houver informações ausentes ou desconhecidas THEN THE sistema SHALL marcá-las explicitamente como `TBD` e listar perguntas essenciais ao usuário.

### R2 — Gerar Spec.md (requisitos e critérios em EARS)
**Como** desenvolvedor, **quero** converter ideias de features em histórias de usuário e critérios formais EARS **para que** o escopo fique claro e testável.

1. WHEN o usuário solicitar uma especificação THE sistema SHALL escrever histórias de usuário no formato "Como / quero / para que".
2. THE sistema SHALL formular cada critério de aceite no padrão formal EARS (`WHEN`, `IF-THEN`, `WHILE`, `WHERE`, `THE sistema SHALL`) com numeração sequencial (R1.1, R1.2…).
3. THE sistema SHALL incluir explicitamente as seções **Fora de escopo** e **Perguntas em aberto**.

### R3 — Gerar Plan.md (design técnico e tarefas)
**Como** desenvolvedor, **quero** um plano técnico com design e tarefas pequenas **para que** um agente executor possa codificar uma tarefa por vez.

1. WHEN a `Spec.md` for aprovada THE sistema SHALL gerar o `Plan.md` contendo Parte A (Design) e Parte B (Tarefas).
2. IF a `Spec.md` não estiver aprovada THEN THE sistema SHALL bloquear o avanço para o Plan e solicitar a validação da Spec.
3. THE sistema SHALL incluir no design: visão geral, arquitetura, componentes, modelo de dados, tratamento de erros, estratégia de testes e diagramas Mermaid válidos.
4. THE sistema SHALL quebrar o trabalho em tarefas pequenas com checkboxes, com cada tarefa referenciando os critérios EARS atendidos (`_Requisitos: Rx.y_`).

### R4 — Gerar AGENTS.md e CLAUDE.md
**Como** desenvolvedor, **quero** arquivos de regras permanentes **para que** qualquer IA (Claude, Codex, Cursor, etc.) obedeça às convenções do projeto.

1. THE sistema SHALL gerar o `AGENTS.md` como fonte única da verdade para comandos, estilo de código, testes e limites.
2. THE sistema SHALL gerar o `CLAUDE.md` importando `@AGENTS.md` e `@docs/Context.md`.

### R5 — Fluxo com aprovação por fases
1. WHILE uma fase não estiver aprovada pelo usuário THE sistema SHALL NÃO avançar para a fase seguinte.
2. WHEN uma fase for concluída pela IA THE sistema SHALL exibir uma pré-visualização editável e permitir que o usuário aprove ou solicite ajustes.

### R6 — Portabilidade e Execução no GitHub Pages
**Como** desenvolvedor, **quero** acessar a ferramenta de qualquer computador sem instalar dependências locais **para que** eu tenha flexibilidade de uso.

1. THE sistema SHALL ser executado 100% no navegador como uma aplicação estática (SPA) hospedada no GitHub Pages.
2. THE sistema SHALL NÃO depender de servidor backend próprio ou banco de dados externo.

### R7 — Conectividade com Groq e OpenRouter (Modelos Gratuitos)
**Como** desenvolvedor, **quero** utilizar modelos de IA gratuitos via Groq ou OpenRouter **para que** eu não precise de assinaturas pagas.

1. WHEN o usuário inserir sua chave de API (Groq ou OpenRouter) THE sistema SHALL armazená-la exclusivamente no `localStorage` do navegador do usuário.
2. THE sistema SHALL NÃO transmitir as chaves de API para nenhum servidor intermediário.
3. THE sistema SHALL suportar modelos gratuitos e rápidos (ex.: Llama 3.3 70B no Groq e modelos `:free` no OpenRouter).
4. IF a chamada de API falhar (chave inválida ou limite excedido) THEN THE sistema SHALL exibir mensagem de erro clara com orientações de correção.

### R8 — Renderização Visual (Markdown e Mermaid)
**Como** desenvolvedor, **quero** ver os documentos e diagramas renderizados visualmente **para que** eu possa validar a arquitetura facilmente.

1. THE sistema SHALL renderizar Markdown formatado em tempo real na tela.
2. THE sistema SHALL renderizar diagramas Mermaid visualmente (fluxogramas e sequências) dentro do plano técnico.

### R9 — Exportação de Arquivos
**Como** desenvolvedor, **quero** baixar os documentos gerados prontos para uso **para que** eu possa colocá-los diretamente no meu repositório.

1. WHEN o processo for finalizado THE sistema SHALL permitir copiar o conteúdo de cada arquivo com um clique.
2. WHEN solicitado THE sistema SHALL gerar e baixar um arquivo compactado `.zip` contendo toda a estrutura de pastas padronizada (`AGENTS.md`, `CLAUDE.md`, `docs/Context.md`, `docs/specs/<feature>/Spec.md`, `docs/specs/<feature>/Plan.md`).

## Fora de escopo
- Execução direta de código ou geração do código-fonte da aplicação (papel de agentes executores).
- Armazenamento em nuvem centralizado das especificações (arquivos ficam no navegador do usuário).
