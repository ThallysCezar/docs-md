# Spec — {{NOME_DA_FEATURE}}

> Requisitos no formato spec-driven: histórias de usuário + critérios de aceite em **EARS**.
> Status: `rascunho` | `aprovado`

## Introdução
{{2–4 linhas: o que é a feature e por que existe. Link para docs/Context.md}}

## Glossário (opcional)
- **{{termo}}:** {{definição}}

## Requisitos

### R1 — {{título curto}}
**Como** {{persona}}, **quero** {{ação}}, **para que** {{benefício}}.

**Critérios de aceite (EARS):**
1. WHEN {{gatilho}} THE sistema SHALL {{resposta}}.
2. IF {{condição indesejada}} THEN THE sistema SHALL {{resposta}}.
3. WHILE {{estado}} THE sistema SHALL {{comportamento}}.
4. WHERE {{feature opcional ativa}} THE sistema SHALL {{comportamento}}.
5. THE sistema SHALL {{requisito sempre válido}}.

### R2 — {{título curto}}
**Como** …, **quero** …, **para que** ….
1. WHEN … THE sistema SHALL ….

## Requisitos não funcionais
- **Desempenho:** THE sistema SHALL {{ex.: responder em < 300 ms no p95}}.
- **Segurança:** …
- **Acessibilidade:** …

## Fora de escopo
- {{o que NÃO será feito nesta feature}}

## Perguntas em aberto
- [ ] {{ambiguidade que precisa de resposta humana}}

---
<details><summary>Cola rápida do EARS</summary>

| Padrão | Forma |
|---|---|
| Sempre | THE <sistema> SHALL <resposta> |
| Evento | WHEN <gatilho> THE <sistema> SHALL <resposta> |
| Estado | WHILE <estado> THE <sistema> SHALL <resposta> |
| Indesejado | IF <condição> THEN THE <sistema> SHALL <resposta> |
| Opcional | WHERE <feature> THE <sistema> SHALL <resposta> |
</details>
