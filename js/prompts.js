/**
 * Construtores de prompts no padrão Spec-Driven para o Doc Architect
 */

export const SYSTEM_ROLE = `Você é o Doc Architect: um arquiteto de documentação técnica para agentes de IA e desenvolvedores.
Você gera especificações rigorosas seguindo as melhores práticas de desenvolvimento orientado a especificações (spec-driven development).
Suas respostas devem ser estritamente no formato Markdown do documento solicitado, sem conversas introdutórias ou conclusivas antes ou depois do código Markdown.
Você NUNCA escreve código de implementação da aplicação; apenas documentação, especificações em EARS, tabelas de design e tarefas.
Idioma padrão: Português do Brasil (pt-BR). Palavras-chave formais do EARS e termos de código ficam no padrão técnico internacional.`;

export function buildContextPrompt(projectName, projectDescription, techStack) {
    return {
        systemPrompt: SYSTEM_ROLE,
        userPrompt: `Gere o arquivo "Context.md" para o projeto "${projectName}".

### Informações fornecidas:
- Descrição da Ideia/Produto: ${projectDescription || 'A definir'}
- Tecnologias e Stack mencionadas: ${techStack || 'A definir'}

### Regras do modelo Context.md:
Gere o documento Markdown seguindo exatamente esta estrutura e seções:
# Context — ${projectName}
> Steering do projeto. Vale para todas as features. Atualize quando o produto, a stack ou a estrutura mudarem.

## 1. Produto
- **O que é:** (uma frase clara e objetiva)
- **Para quem:** (usuários / personas identificadas)
- **Problema que resolve:** (dor principal)
- **Objetivos de negócio:** (2 a 4 bullets)
- **Não é (anti-objetivos):** (o que o produto deliberadamente não faz)

## 2. Tecnologia
(Tabela com colunas: Camada | Escolha | Versão / Detalhe | Observação)
Camadas obrigatórias: Linguagem, Framework, Banco de dados / Armazenamento, Testes, Infra / deploy.
**Restrições técnicas:** (ex: segurança, offline, restrição de libs)
**Integrações externas:** (APIs de terceiros ou serviços)

## 3. Estrutura
(Árvore de pastas em bloco de código ASCII, 2 a 3 níveis)
- **Convenções de nomes:** (padrão de arquivos, classes, rotas)
- **Onde fica o quê:** (separação de responsabilidades)

## 4. Glossário
(Tabela com Termo e Significado dos jargões do domínio)

## 5. Decisões importantes (ADR resumido)
(Tabela com Data | Decisão | Motivo)

Importante: Qualquer item cujo detalhe não foi informado deve ser explicitamente preenchido como "TBD" (To Be Defined). NÃO invente detalhes que não foram especificados.`
    };
}

export function buildSpecPrompt(projectName, featureName, featureDescription, approvedContext) {
    return {
        systemPrompt: SYSTEM_ROLE,
        userPrompt: `Gere o arquivo "Spec.md" para a feature "${featureName}" do projeto "${projectName}".

### Contexto Geral do Projeto (Context.md já aprovado):
\`\`\`markdown
${approvedContext}
\`\`\`

### Descrição da Feature solicitada:
${featureDescription}

### Regras do modelo Spec.md (Padrão Spec-Driven & EARS):
Gere o documento Markdown contendo:
# Spec — ${featureName}
> Requisitos no padrão spec-driven: histórias de usuário + critérios de aceite em EARS.
> Status: aprovado

## Introdução
(2 a 4 linhas explicando a feature, seu valor e link de referência para docs/Context.md)

## Glossário (se aplicável para a feature)

## Requisitos Funcionais
Divida a feature em requisitos numerados (R1, R2, etc.).
Para cada requisito:
### Rx — [Título curto]
**Como** [persona], **quero** [ação], **para que** [benefício].

**Critérios de aceite (EARS):**
Cada critério DEVE usar estritamente uma das estruturas EARS:
- Event-driven: "WHEN <gatilho> THE sistema SHALL <resposta>."
- Indesejado/Exceção: "IF <condição indesejada> THEN THE sistema SHALL <resposta>."
- Estado: "WHILE <estado> THE sistema SHALL <comportamento>."
- Opcional: "WHERE <condição opcional> THE sistema SHALL <comportamento>."
- Permanente: "THE sistema SHALL <comportamento obrigatório contínuo>."
Cada critério deve ser numerado (ex: R1.1, R1.2, R2.1...).

## Requisitos não funcionais
- Desempenho
- Segurança
- Acessibilidade / Usabilidade

## Fora de escopo
(Liste de forma explícita o que NÃO faz parte desta feature para evitar escopo inflado)

## Perguntas em aberto
(Checkboxes de dúvidas ou ambiguidades que precisam de decisão humana)

Retorne APENAS o Markdown completo e bem estruturado da Spec.`
    };
}

export function buildPlanPrompt(projectName, featureName, approvedContext, approvedSpec) {
    return {
        systemPrompt: SYSTEM_ROLE,
        userPrompt: `Gere o arquivo "Plan.md" (Design Técnico e Tarefas) para a feature "${featureName}" do projeto "${projectName}".

### Contexto Aprovado:
\`\`\`markdown
${approvedContext}
\`\`\`

### Spec Aprovada (Requisitos em EARS):
\`\`\`markdown
${approvedSpec}
\`\`\`

### Regras do modelo Plan.md (Padrão Spec-Driven):
Gere o documento dividido estritamente em duas partes:

# Plan — ${featureName}
> Consolida o design técnico e o checklist de tarefas. Gerado a partir de Spec.md aprovada.
> Status: aprovado

# Parte A — Design

## Visão geral
(Abordagem técnica em 3 a 5 linhas)

## Arquitetura
(Diagrama Mermaid válido em bloco \`\`\`mermaid - flowchart LR ou flowchart TD. NUNCA use caracteres inválidos nos rótulos sem aspas)

## Componentes
(Tabela: Componente | Responsabilidade | Arquivo(s) previsto(s) | Requisitos atendidos)

## Modelo de dados
(Definição de entidades, tipos e campos)

## Interfaces / Contratos
(Tabela: Método/Função | Rota ou Assinatura | Entrada | Saída | Erros previstos)

## Fluxo principal
(Diagrama Mermaid válido de sequência em bloco \`\`\`mermaid - sequenceDiagram)

## Tratamento de erros
(Tabela: Cenário | Comportamento esperado | Requisito)

## Estratégia de testes
- Unitários
- Integração
- Aceite (Como cada critério EARS da Spec será testado)

## Riscos e alternativas descartadas

# Parte B — Tarefas
> Regras: Uma tarefa por commit. Siga a ordem lógica. Cada tarefa deve referenciar os requisitos que atende.

Checklist de tarefas atômicas numeradas:
- [ ] 1. [Nome da tarefa de setup/base]
  - [Detalhes técnicos da tarefa]
  - _Requisitos: Rx.y_
- [ ] 2. [Implementar componente X]
  - [ ] 2.1 [subtarefa] — _Requisitos: Rx.y_
  - [ ] 2.2 [testes de X] — _Requisitos: Rx.y_
(Garanta que TODOS os requisitos da Spec apareçam em pelo menos uma tarefa)

## Definição de pronto (Definition of Done)
- [ ] Todos os critérios de aceite da Spec cobertos por testes
- [ ] Lint e build passando
- [ ] docs/Context.md atualizado se a estrutura mudou

Retorne APENAS o Markdown completo do Plan.md com blocos Mermaid perfeitamente formatados.`
    };
}

export function buildAgentsPrompt(projectName, approvedContext) {
    return {
        systemPrompt: SYSTEM_ROLE,
        userPrompt: `Gere o arquivo "AGENTS.md" para o projeto "${projectName}".

### Contexto do Projeto:
\`\`\`markdown
${approvedContext}
\`\`\`

### Regras do modelo AGENTS.md:
Gere o documento Markdown conciso que serve como fonte única de verdade para qualquer agente de IA (Claude Code, Cursor, Copilot, Codex, etc.):
# AGENTS.md
> Regras para qualquer agente de IA que trabalhe neste repositório.
> Detalhes do produto ficam em docs/Context.md.

## Projeto
(Resumo em uma frase referenciando docs/Context.md)

## Comandos essenciais
(Bloco bash com comandos de instalar dependências, rodar, testar e lint extraídos do contexto)

## Fluxo de trabalho (spec-driven)
1. Leia docs/Context.md.
2. Para uma feature nova, verifique se existe docs/specs/<feature>/Spec.md aprovada. Se não houver, pare e peça.
3. Siga docs/specs/<feature>/Plan.md uma tarefa por vez, marcando [x] ao terminar.
4. Toda mudança precisa atender a um critério EARS da Spec.

## Estilo de código e convenções
(Convenções da stack definida no Context.md)

## Testes
(Diretrizes de testes: não marcar tarefas com testes falhando)

## Limites (O que o agente NÃO deve fazer)
- Não alterar arquivos de ambiente sensíveis (.env, chaves)
- Não adicionar dependências sem justificar no Plan.md
- Não fazer commits fora do padrão

## Git e Versionamento
(Padrão de commits convencionais e nomenclatura de branches)

Retorne APENAS o Markdown do AGENTS.md.`
    };
}

export function buildClaudePrompt(projectName) {
    return {
        systemPrompt: SYSTEM_ROLE,
        userPrompt: `Gere o arquivo "CLAUDE.md" para o projeto "${projectName}".

### Regras do modelo CLAUDE.md:
Deve ser curto e direto, aproveitando a herança do AGENTS.md:
# CLAUDE.md

@AGENTS.md
@docs/Context.md

## Específico do Claude Code
- Antes de implementar qualquer código, leia a Spec e o Plan da feature em docs/specs/<feature>/.
- Use o modo de planejamento (plan mode) em alterações com múltiplos arquivos.
- Para gerar ou alterar documentação de especificações, siga o padrão spec-driven.
- Mantenha respostas concisas em português (pt-BR).

Retorne APENAS o Markdown do CLAUDE.md.`
    };
}
