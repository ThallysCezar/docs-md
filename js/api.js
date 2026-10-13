/**
 * Cliente de API para Groq e OpenRouter
 */

import { PROVIDERS, STORAGE_KEYS } from './config.js';

export function getStoredKey(providerId) {
    if (providerId === 'groq') {
        return localStorage.getItem(STORAGE_KEYS.GROQ_KEY) || '';
    } else if (providerId === 'openrouter') {
        return localStorage.getItem(STORAGE_KEYS.OPENROUTER_KEY) || '';
    }
    return '';
}

export function saveStoredKey(providerId, apiKey) {
    if (providerId === 'groq') {
        localStorage.setItem(STORAGE_KEYS.GROQ_KEY, apiKey.trim());
    } else if (providerId === 'openrouter') {
        localStorage.setItem(STORAGE_KEYS.OPENROUTER_KEY, apiKey.trim());
    }
}

export async function callLLM({ providerId, modelId, apiKey, systemPrompt, userPrompt, temperature = 0.2 }) {
    const provider = PROVIDERS[providerId];
    if (!provider) {
        throw new Error(`Provedor desconhecido: ${providerId}`);
    }

    if (!apiKey || apiKey.trim() === '') {
        throw new Error(`Chave de API do ${provider.name} não informada. Configure no topo da página.`);
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
    };

    // OpenRouter recomenda headers de identificação
    if (providerId === 'openrouter') {
        headers['HTTP-Referer'] = window.location.origin || 'https://github.com';
        headers['X-Title'] = 'Doc Architect (Spec-Driven)';
    }

    const payload = {
        model: modelId,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: temperature
    };

    let response;
    try {
        response = await fetch(provider.endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload)
        });
    } catch (networkError) {
        throw new Error(`Falha de conexão com a API do ${provider.name}. Verifique sua conexão ou se há bloqueador de anúncios/scripts ativo.`);
    }

    if (!response.ok) {
        let errorDetails = '';
        try {
            const errJson = await response.json();
            errorDetails = errJson.error?.message || JSON.stringify(errJson);
        } catch (_) {
            errorDetails = await response.text();
        }

        if (response.status === 401) {
            throw new Error(`Erro 401 (Não autorizado): A chave de API fornecida para ${provider.name} é inválida. Verifique sua chave no console.`);
        } else if (response.status === 429) {
            throw new Error(`Erro 429 (Limite de requisições excedido): O provedor ${provider.name} atingiu a cota temporária. Aguarde alguns instantes ou troque de modelo.`);
        } else {
            throw new Error(`Erro da API (${response.status}): ${errorDetails || response.statusText}`);
        }
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('A IA retornou uma resposta vazia. Tente novamente.');
    }

    return content.trim();
}
