/**
 * Configurações de provedores e modelos de IA para o Doc Architect
 */

export const PROVIDERS = {
    groq: {
        id: 'groq',
        name: 'Groq (Recomendado - Ultrarrápido)',
        badge: 'Gratuito & Rápido',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        apiKeyUrl: 'https://console.groq.com/keys',
        defaultModel: 'llama-3.3-70b-versatile',
        models: [
            {
                id: 'llama-3.3-70b-versatile',
                name: 'Llama 3.3 70B Versatile',
                description: 'Mais inteligente, excelente para arquitetura e requisitos EARS (Recomendado).'
            },
            {
                id: 'llama-3.1-8b-instant',
                name: 'Llama 3.1 8B Instant',
                description: 'Geração quase instantânea, ideal para testes rápidos.'
            },
            {
                id: 'mixtral-8x7b-32768',
                name: 'Mixtral 8x7B (Contexto 32k)',
                description: 'Bom para especificações e contextos longos.'
            }
        ]
    },
    openrouter: {
        id: 'openrouter',
        name: 'OpenRouter (Modelos Abertos & Gratuitos)',
        badge: 'Múltiplos Modelos :free',
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        apiKeyUrl: 'https://openrouter.ai/keys',
        defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
        models: [
            {
                id: 'meta-llama/llama-3.3-70b-instruct:free',
                name: 'Llama 3.3 70B Instruct (Free)',
                description: 'Modelo topo de linha livre de custos no OpenRouter.'
            },
            {
                id: 'deepseek/deepseek-r1:free',
                name: 'DeepSeek R1 (Free - Raciocínio Profundo)',
                description: 'Excelente capacidade analítica e de planejamento lógico.'
            },
            {
                id: 'google/gemini-2.0-flash-exp:free',
                name: 'Gemini 2.0 Flash Exp (Free)',
                description: 'Rápido e multimodal do Google via OpenRouter.'
            },
            {
                id: 'qwen/qwen-2.5-coder-32b-instruct:free',
                name: 'Qwen 2.5 Coder 32B (Free)',
                description: 'Otimizado para código, arquitetura técnica e contratos.'
            }
        ]
    }
};

export const STORAGE_KEYS = {
    PROVIDER: 'doc_architect_provider',
    GROQ_KEY: 'doc_architect_groq_key',
    OPENROUTER_KEY: 'doc_architect_openrouter_key',
    MODEL: 'doc_architect_model',
    PROJECT_NAME: 'doc_architect_project_name',
    FEATURE_NAME: 'doc_architect_feature_name'
};
