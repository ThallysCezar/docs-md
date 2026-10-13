/**
 * Doc Architect — Controlador Principal da Aplicação Web
 */

import { PROVIDERS, STORAGE_KEYS } from './config.js';
import { getStoredKey, saveStoredKey, callLLM } from './api.js';
import { 
    buildContextPrompt, 
    buildSpecPrompt, 
    buildPlanPrompt, 
    buildAgentsPrompt, 
    buildClaudePrompt 
} from './prompts.js';
import { downloadZipPackage, copyToClipboard, slugify } from './export.js';

// Estado global da aplicação
const state = {
    currentStage: 1,
    provider: localStorage.getItem(STORAGE_KEYS.PROVIDER) || 'groq',
    model: localStorage.getItem(STORAGE_KEYS.MODEL) || PROVIDERS.groq.defaultModel,
    projectName: localStorage.getItem(STORAGE_KEYS.PROJECT_NAME) || '',
    featureName: localStorage.getItem(STORAGE_KEYS.FEATURE_NAME) || '',
    
    // Conteúdo gerado dos arquivos
    docs: {
        context: '',
        spec: '',
        plan: '',
        agents: '',
        claude: ''
    },
    
    // Status de aprovação
    approved: {
        context: false,
        spec: false,
        plan: false
    }
};

// Inicialização do Mermaid
if (window.mermaid) {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true },
        sequence: { useMaxWidth: true }
    });
}

// Inicialização do Marked com Highlight.js
if (window.marked) {
    marked.setOptions({
        gfm: true,
        breaks: true,
        highlight: function(code, lang) {
            if (lang && lang === 'mermaid') return code; // não destaca com hljs para o mermaid processar
            if (window.hljs && lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return code;
        }
    });
}

// Elementos do DOM
const dom = {
    // Top Bar & Modal
    btnOpenSettings: document.getElementById('btn-open-settings'),
    modalSettings: document.getElementById('modal-settings'),
    btnCloseSettings: document.getElementById('btn-close-settings'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    apiStatusDot: document.getElementById('api-status-dot'),
    apiStatusText: document.getElementById('api-status-text'),
    selectModel: document.getElementById('select-model'),
    modelDescription: document.getElementById('model-description'),
    inputApiKey: document.getElementById('input-api-key'),
    labelApiKey: document.getElementById('label-api-key'),
    linkGetKey: document.getElementById('link-get-key'),
    btnToggleKeyVisibility: document.getElementById('btn-toggle-key-visibility'),
    providerCards: document.querySelectorAll('.provider-radio-card'),
    btnOpenTutorial: document.getElementById('btn-open-tutorial'),
    linkTutorialModal: document.getElementById('link-tutorial-modal'),
    modalTutorial: document.getElementById('modal-tutorial'),
    btnCloseTutorial: document.getElementById('btn-close-tutorial'),
    btnTutorialUnderstood: document.getElementById('btn-tutorial-understood'),
    
    // Banner
    alertBanner: document.getElementById('alert-banner'),
    alertIcon: document.getElementById('alert-icon'),
    alertMessage: document.getElementById('alert-message'),
    alertClose: document.getElementById('alert-close'),

    // Stepper Tabs
    stepTabs: [
        document.getElementById('step-tab-1'),
        document.getElementById('step-tab-2'),
        document.getElementById('step-tab-3'),
        document.getElementById('step-tab-4')
    ],
    stages: [
        document.getElementById('stage-1'),
        document.getElementById('stage-2'),
        document.getElementById('stage-3'),
        document.getElementById('stage-4')
    ],

    // Stage 1
    inputProjectName: document.getElementById('input-project-name'),
    inputProjectDesc: document.getElementById('input-project-desc'),
    inputTechStack: document.getElementById('input-tech-stack'),
    btnGenerateContext: document.getElementById('btn-generate-context'),
    contextPreviewContainer: document.getElementById('context-preview-container'),
    contextRawEditor: document.getElementById('context-raw-editor'),
    tabContextPreview: document.getElementById('tab-context-preview'),
    tabContextEdit: document.getElementById('tab-context-edit'),
    btnCopyContext: document.getElementById('btn-copy-context'),
    btnApproveContext: document.getElementById('btn-approve-context'),
    contextBadge: document.getElementById('context-badge'),

    // Stage 2
    inputFeatureName: document.getElementById('input-feature-name'),
    inputFeatureDesc: document.getElementById('input-feature-desc'),
    btnGenerateSpec: document.getElementById('btn-generate-spec'),
    specPreviewContainer: document.getElementById('spec-preview-container'),
    specRawEditor: document.getElementById('spec-raw-editor'),
    tabSpecPreview: document.getElementById('tab-spec-preview'),
    tabSpecEdit: document.getElementById('tab-spec-edit'),
    btnCopySpec: document.getElementById('btn-copy-spec'),
    btnApproveSpec: document.getElementById('btn-approve-spec'),
    btnBackToContext: document.getElementById('btn-back-to-context'),
    specFileLabel: document.getElementById('spec-file-label'),
    specBadge: document.getElementById('spec-badge'),

    // Stage 3
    summaryProjectName: document.getElementById('summary-project-name'),
    summaryFeatureName: document.getElementById('summary-feature-name'),
    btnGeneratePlan: document.getElementById('btn-generate-plan'),
    planPreviewContainer: document.getElementById('plan-preview-container'),
    planRawEditor: document.getElementById('plan-raw-editor'),
    tabPlanPreview: document.getElementById('tab-plan-preview'),
    tabPlanEdit: document.getElementById('tab-plan-edit'),
    btnCopyPlan: document.getElementById('btn-copy-plan'),
    btnApprovePlan: document.getElementById('btn-approve-plan'),
    btnBackToSpec: document.getElementById('btn-back-to-spec'),
    planFileLabel: document.getElementById('plan-file-label'),
    planBadge: document.getElementById('plan-badge'),

    // Stage 4
    btnDownloadZip: document.getElementById('btn-download-zip'),
    finalFilesTabs: document.querySelectorAll('.final-tab-btn'),
    finalPreviewContainer: document.getElementById('final-preview-container'),
    btnCopyActiveFinal: document.getElementById('btn-copy-active-final')
};

let activeFinalFile = 'agents';

// ==========================================
// FUNÇÕES DE RENDERIZAÇÃO MARKDOWN & MERMAID
// ==========================================

async function renderMarkdownWithMermaid(markdownText, container) {
    if (!markdownText || markdownText.trim() === '') {
        container.innerHTML = '<p class="text-slate-500 italic">Nenhum conteúdo gerado ainda.</p>';
        return;
    }

    try {
        const rawHtml = marked.parse(markdownText);
        container.innerHTML = rawHtml;

        // Renderizar diagramas Mermaid encontrados
        const codeBlocks = container.querySelectorAll('pre code');
        for (let i = 0; i < codeBlocks.length; i++) {
            const codeEl = codeBlocks[i];
            const preEl = codeEl.parentElement;
            
            // Verifica se é bloco mermaid
            if (codeEl.classList.contains('language-mermaid') || codeEl.textContent.trim().startsWith('flowchart') || codeEl.textContent.trim().startsWith('sequenceDiagram') || codeEl.textContent.trim().startsWith('graph')) {
                const graphDefinition = codeEl.textContent.trim();
                const uniqueId = `mermaid-svg-${Date.now()}-${i}`;
                
                try {
                    const { svg } = await mermaid.render(uniqueId, graphDefinition);
                    const div = document.createElement('div');
                    div.className = 'mermaid-container';
                    div.innerHTML = svg;
                    preEl.replaceWith(div);
                } catch (mermaidErr) {
                    console.warn('Erro ao renderizar diagrama Mermaid:', mermaidErr);
                    // Mantém o bloco de código visível com aviso suave
                    preEl.classList.add('border-amber-600/60');
                }
            } else {
                if (window.hljs) hljs.highlightElement(codeEl);
            }
        }
    } catch (err) {
        container.innerHTML = `<pre class="text-red-400 p-4">${markdownText}</pre>`;
    }
}

// ==========================================
// NOTIFICAÇÕES & BANNER
// ==========================================

function showAlert(message, type = 'info') {
    dom.alertBanner.classList.remove('hidden', 'bg-red-950/60', 'border-red-800', 'text-red-200', 'bg-emerald-950/60', 'border-emerald-800', 'text-emerald-200', 'bg-indigo-950/60', 'border-indigo-800', 'text-indigo-200');
    
    if (type === 'error') {
        dom.alertBanner.classList.add('bg-red-950/60', 'border-red-800', 'text-red-200');
        dom.alertIcon.textContent = '⚠️';
    } else if (type === 'success') {
        dom.alertBanner.classList.add('bg-emerald-950/60', 'border-emerald-800', 'text-emerald-200');
        dom.alertIcon.textContent = '✅';
    } else {
        dom.alertBanner.classList.add('bg-indigo-950/60', 'border-indigo-800', 'text-indigo-200');
        dom.alertIcon.textContent = 'ℹ️';
    }

    dom.alertMessage.innerHTML = message;
    dom.alertBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideAlert() {
    dom.alertBanner.classList.add('hidden');
}

// ==========================================
// CONFIGURAÇÃO DE PROVEDORES & CHAVES
// ==========================================

function updateProviderStatus() {
    const key = getStoredKey(state.provider);
    const providerInfo = PROVIDERS[state.provider];
    
    if (key && key.trim() !== '') {
        dom.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block';
        dom.apiStatusText.textContent = `${providerInfo.id === 'groq' ? 'Groq' : 'OpenRouter'}: Conectado`;
    } else {
        dom.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 inline-block';
        dom.apiStatusText.textContent = 'Configurar Chave IA';
    }
}

function populateModelsDropdown() {
    const provider = PROVIDERS[state.provider];
    dom.selectModel.innerHTML = '';
    
    provider.models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        if (model.id === state.model) option.selected = true;
        dom.selectModel.appendChild(option);
    });

    const activeModel = provider.models.find(m => m.id === state.model) || provider.models[0];
    dom.modelDescription.textContent = activeModel.description;

    // Atualiza links e labels da chave
    dom.labelApiKey.textContent = `Chave de API do ${provider.id === 'groq' ? 'Groq' : 'OpenRouter'}`;
    dom.linkGetKey.href = provider.apiKeyUrl;
    dom.inputApiKey.value = getStoredKey(state.provider);
    dom.inputApiKey.placeholder = provider.id === 'groq' ? 'gsk_...' : 'sk-or-...';
}

function openSettingsModal() {
    // Atualiza estado visual dos cards de rádio
    dom.providerCards.forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio.value === state.provider) {
            radio.checked = true;
            card.classList.add('border-indigo-500', 'bg-indigo-950/40');
            card.classList.remove('border-slate-800', 'bg-slate-950');
        } else {
            card.classList.remove('border-indigo-500', 'bg-indigo-950/40');
            card.classList.add('border-slate-800', 'bg-slate-950');
        }
    });

    populateModelsDropdown();
    dom.modalSettings.classList.remove('hidden');
}

function closeSettingsModal() {
    dom.modalSettings.classList.add('hidden');
}

function saveSettings() {
    const key = dom.inputApiKey.value.trim();
    saveStoredKey(state.provider, key);
    state.model = dom.selectModel.value;
    localStorage.setItem(STORAGE_KEYS.PROVIDER, state.provider);
    localStorage.setItem(STORAGE_KEYS.MODEL, state.model);

    updateProviderStatus();
    closeSettingsModal();
    showAlert(`Configurações salvas! Usando <strong>${state.provider.toUpperCase()}</strong> com o modelo <strong>${state.model}</strong>.`, 'success');
}

function openTutorialModal() {
    if (dom.modalTutorial) dom.modalTutorial.classList.remove('hidden');
}

function closeTutorialModal() {
    if (dom.modalTutorial) dom.modalTutorial.classList.add('hidden');
}

// ==========================================
// CONTROLE DO WIZARD (STAGES)
// ==========================================

function switchStage(targetStage) {
    state.currentStage = targetStage;

    // Atualiza classes do Stepper
    dom.stepTabs.forEach((tab, index) => {
        const stepIndex = index + 1;
        const numBadge = tab.querySelector('.step-num');
        
        tab.classList.remove('active', 'border-indigo-500/50', 'bg-indigo-950/40', 'text-indigo-300', 'border-emerald-600/50', 'bg-emerald-950/30', 'text-emerald-300');
        numBadge.classList.remove('bg-indigo-600', 'bg-emerald-600', 'bg-slate-800');

        if (stepIndex === targetStage) {
            tab.classList.add('active', 'border-indigo-500/50', 'bg-indigo-950/40', 'text-indigo-300');
            numBadge.classList.add('bg-indigo-600', 'text-white');
        } else if (stepIndex < targetStage) {
            tab.classList.add('border-emerald-600/50', 'bg-emerald-950/30', 'text-emerald-300');
            numBadge.classList.add('bg-emerald-600', 'text-white');
            numBadge.innerHTML = '✓';
        } else {
            tab.classList.add('border-slate-800', 'bg-slate-900', 'text-slate-400');
            numBadge.classList.add('bg-slate-800', 'text-slate-400');
            numBadge.textContent = stepIndex;
        }
    });

    // Exibe a seção correta
    dom.stages.forEach((sec, idx) => {
        if (idx + 1 === targetStage) {
            sec.classList.remove('hidden');
        } else {
            sec.classList.add('hidden');
        }
    });

    hideAlert();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Alternar abas entre Preview e Raw Editor
function setupEditorTabs(tabPreview, tabEdit, previewContainer, rawEditor, getDocKey) {
    tabPreview.addEventListener('click', async () => {
        // Salva do editor para o estado
        state.docs[getDocKey()] = rawEditor.value;
        rawEditor.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        
        tabPreview.classList.add('bg-indigo-600', 'text-white');
        tabPreview.classList.remove('text-slate-400');
        tabEdit.classList.remove('bg-indigo-600', 'text-white');
        tabEdit.classList.add('text-slate-400');

        await renderMarkdownWithMermaid(state.docs[getDocKey()], previewContainer);
    });

    tabEdit.addEventListener('click', () => {
        rawEditor.value = state.docs[getDocKey()];
        previewContainer.classList.add('hidden');
        rawEditor.classList.remove('hidden');

        tabEdit.classList.add('bg-indigo-600', 'text-white');
        tabEdit.classList.remove('text-slate-400');
        tabPreview.classList.remove('bg-indigo-600', 'text-white');
        tabPreview.classList.add('text-slate-400');
    });

    rawEditor.addEventListener('input', () => {
        state.docs[getDocKey()] = rawEditor.value;
    });
}

// ==========================================
// FASE 1: CONTEXT.MD
// ==========================================

async function handleGenerateContext() {
    const key = getStoredKey(state.provider);
    if (!key) {
        openSettingsModal();
        showAlert('Insira sua chave de API gratuita antes de gerar o documento.', 'error');
        return;
    }

    const projectName = dom.inputProjectName.value.trim() || 'MeuProjeto';
    const projectDesc = dom.inputProjectDesc.value.trim();
    const techStack = dom.inputTechStack.value.trim();

    if (!projectDesc) {
        showAlert('Por favor, informe uma descrição básica do produto ou a dor que ele resolve.', 'error');
        dom.inputProjectDesc.focus();
        return;
    }

    state.projectName = projectName;
    localStorage.setItem(STORAGE_KEYS.PROJECT_NAME, projectName);

    setButtonLoading(dom.btnGenerateContext, true, 'Gerando Context.md...');
    hideAlert();

    try {
        const { systemPrompt, userPrompt } = buildContextPrompt(projectName, projectDesc, techStack);
        const generated = await callLLM({
            providerId: state.provider,
            modelId: state.model,
            apiKey: key,
            systemPrompt,
            userPrompt
        });

        state.docs.context = generated;
        dom.contextRawEditor.value = generated;
        dom.contextBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50';
        dom.contextBadge.textContent = 'Rascunho gerado (Aguardando aprovação)';

        await renderMarkdownWithMermaid(generated, dom.contextPreviewContainer);
        dom.btnApproveContext.disabled = false;
        showAlert('Context.md gerado com sucesso! Revise o conteúdo acima e clique em <strong>Aprovar Contexto & Avançar</strong>.', 'success');
    } catch (err) {
        showAlert(err.message, 'error');
    } finally {
        setButtonLoading(dom.btnGenerateContext, false, 'Gerar Context.md com IA');
    }
}

function handleApproveContext() {
    state.approved.context = true;
    dom.contextBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50';
    dom.contextBadge.textContent = 'Contexto Aprovado ✓';

    dom.summaryProjectName.textContent = state.projectName;
    switchStage(2);
}

// ==========================================
// FASE 2: SPEC.MD
// ==========================================

async function handleGenerateSpec() {
    const key = getStoredKey(state.provider);
    if (!key) {
        openSettingsModal();
        return;
    }

    const featureName = dom.inputFeatureName.value.trim() || 'nova-feature';
    const featureDesc = dom.inputFeatureDesc.value.trim();

    if (!featureDesc) {
        showAlert('Por favor, descreva as regras e comportamento esperado para a feature.', 'error');
        dom.inputFeatureDesc.focus();
        return;
    }

    state.featureName = slugify(featureName);
    localStorage.setItem(STORAGE_KEYS.FEATURE_NAME, state.featureName);
    dom.specFileLabel.textContent = `docs/specs/${state.featureName}/Spec.md`;

    setButtonLoading(dom.btnGenerateSpec, true, 'Modelando requisitos em EARS...');
    hideAlert();

    try {
        const { systemPrompt, userPrompt } = buildSpecPrompt(state.projectName, featureName, featureDesc, state.docs.context);
        const generated = await callLLM({
            providerId: state.provider,
            modelId: state.model,
            apiKey: key,
            systemPrompt,
            userPrompt
        });

        state.docs.spec = generated;
        dom.specRawEditor.value = generated;
        dom.specBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50';
        dom.specBadge.textContent = 'Rascunho com EARS (Aguardando aprovação)';

        await renderMarkdownWithMermaid(generated, dom.specPreviewContainer);
        dom.btnApproveSpec.disabled = false;
        showAlert('Spec.md gerada com histórias e critérios formais EARS! Revise e clique em <strong>Aprovar Spec</strong>.', 'success');
    } catch (err) {
        showAlert(err.message, 'error');
    } finally {
        setButtonLoading(dom.btnGenerateSpec, false, 'Gerar Spec.md (EARS) com IA');
    }
}

function handleApproveSpec() {
    state.approved.spec = true;
    dom.specBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50';
    dom.specBadge.textContent = 'Spec Aprovada ✓';

    dom.summaryFeatureName.textContent = state.featureName;
    dom.planFileLabel.textContent = `docs/specs/${state.featureName}/Plan.md`;
    switchStage(3);
}

// ==========================================
// FASE 3: PLAN.MD
// ==========================================

async function handleGeneratePlan() {
    const key = getStoredKey(state.provider);
    if (!key) {
        openSettingsModal();
        return;
    }

    setButtonLoading(dom.btnGeneratePlan, true, 'Desenhando arquitetura e tarefas...');
    hideAlert();

    try {
        const { systemPrompt, userPrompt } = buildPlanPrompt(state.projectName, state.featureName, state.docs.context, state.docs.spec);
        const generated = await callLLM({
            providerId: state.provider,
            modelId: state.model,
            apiKey: key,
            systemPrompt,
            userPrompt
        });

        state.docs.plan = generated;
        dom.planRawEditor.value = generated;
        dom.planBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 border border-amber-700/50';
        dom.planBadge.textContent = 'Plano gerado (Aguardando aprovação)';

        await renderMarkdownWithMermaid(generated, dom.planPreviewContainer);
        dom.btnApprovePlan.disabled = false;
        showAlert('Plan.md gerado com diagramas Mermaid e lista de tarefas atômicas! Confira os diagramas e aprove.', 'success');
    } catch (err) {
        showAlert(err.message, 'error');
    } finally {
        setButtonLoading(dom.btnGeneratePlan, false, 'Gerar Plan.md com IA');
    }
}

async function handleApprovePlan() {
    state.approved.plan = true;
    dom.planBadge.className = 'text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50';
    dom.planBadge.textContent = 'Plano Aprovado ✓';

    // Gerar regras finais (AGENTS.md e CLAUDE.md)
    showAlert('Gerando arquivos de regras (AGENTS.md e CLAUDE.md)...', 'info');
    const key = getStoredKey(state.provider);

    try {
        const pAgents = buildAgentsPrompt(state.projectName, state.docs.context);
        const pClaude = buildClaudePrompt(state.projectName);

        const [agentsRes, claudeRes] = await Promise.all([
            callLLM({ providerId: state.provider, modelId: state.model, apiKey: key, systemPrompt: pAgents.systemPrompt, userPrompt: pAgents.userPrompt }),
            callLLM({ providerId: state.provider, modelId: state.model, apiKey: key, systemPrompt: pClaude.systemPrompt, userPrompt: pClaude.userPrompt })
        ]);

        state.docs.agents = agentsRes;
        state.docs.claude = claudeRes;

        switchStage(4);
        renderFinalPreview('agents');
        showAlert('Todos os arquivos foram criados com sucesso no padrão spec-driven! Você já pode baixar o pacote ZIP.', 'success');
    } catch (err) {
        showAlert(`Falha ao gerar regras finais: ${err.message}`, 'error');
        switchStage(4);
    }
}

// ==========================================
// FASE 4: VISUALIZADOR FINAL & EXPORTAÇÃO
// ==========================================

async function renderFinalPreview(fileKey) {
    activeFinalFile = fileKey;

    dom.finalFilesTabs.forEach(btn => {
        if (btn.getAttribute('data-file') === fileKey) {
            btn.classList.add('bg-indigo-600', 'text-white');
            btn.classList.remove('text-slate-400');
        } else {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('text-slate-400');
        }
    });

    const content = state.docs[fileKey] || '';
    await renderMarkdownWithMermaid(content, dom.finalPreviewContainer);
}

// ==========================================
// UTILITÁRIOS DE BOTÕES
// ==========================================

function setButtonLoading(button, isLoading, text) {
    const spinner = button.querySelector('.btn-spinner');
    const textSpan = button.querySelector('.btn-text');
    
    button.disabled = isLoading;
    if (isLoading) {
        if (spinner) spinner.classList.remove('hidden');
        if (textSpan) textSpan.textContent = text;
    } else {
        if (spinner) spinner.classList.add('hidden');
        if (textSpan) textSpan.textContent = text;
    }
}

// ==========================================
// EVENT LISTENERS & INICIALIZAÇÃO
// ==========================================

function initEventListeners() {
    // Modal de Chaves
    dom.btnOpenSettings.addEventListener('click', openSettingsModal);
    dom.btnCloseSettings.addEventListener('click', closeSettingsModal);
    dom.btnSaveSettings.addEventListener('click', saveSettings);

    // Modal de Tutorial
    if (dom.btnOpenTutorial) dom.btnOpenTutorial.addEventListener('click', openTutorialModal);
    if (dom.linkTutorialModal) dom.linkTutorialModal.addEventListener('click', () => {
        closeSettingsModal();
        openTutorialModal();
    });
    if (dom.btnCloseTutorial) dom.btnCloseTutorial.addEventListener('click', closeTutorialModal);
    if (dom.btnTutorialUnderstood) dom.btnTutorialUnderstood.addEventListener('click', () => {
        closeTutorialModal();
        openSettingsModal();
    });
    
    // Toggle visibilidade da senha
    dom.btnToggleKeyVisibility.addEventListener('click', () => {
        const isPassword = dom.inputApiKey.type === 'password';
        dom.inputApiKey.type = isPassword ? 'text' : 'password';
        dom.btnToggleKeyVisibility.textContent = isPassword ? '🔒' : '👁️';
    });

    // Mudança de Provedor
    dom.providerCards.forEach(card => {
        card.addEventListener('click', () => {
            const radio = card.querySelector('input[type="radio"]');
            radio.checked = true;
            state.provider = radio.value;

            dom.providerCards.forEach(c => {
                c.classList.remove('border-indigo-500', 'bg-indigo-950/40');
                c.classList.add('border-slate-800', 'bg-slate-950');
            });
            card.classList.add('border-indigo-500', 'bg-indigo-950/40');
            card.classList.remove('border-slate-800', 'bg-slate-950');

            state.model = PROVIDERS[state.provider].defaultModel;
            populateModelsDropdown();
        });
    });

    dom.selectModel.addEventListener('change', (e) => {
        state.model = e.target.value;
        const provider = PROVIDERS[state.provider];
        const m = provider.models.find(item => item.id === state.model);
        if (m) dom.modelDescription.textContent = m.description;
    });

    // Alerta
    dom.alertClose.addEventListener('click', hideAlert);

    // Navegação Stepper
    dom.stepTabs[0].addEventListener('click', () => switchStage(1));
    dom.stepTabs[1].addEventListener('click', () => { if (state.approved.context) switchStage(2); });
    dom.stepTabs[2].addEventListener('click', () => { if (state.approved.spec) switchStage(3); });
    dom.stepTabs[3].addEventListener('click', () => { if (state.approved.plan) switchStage(4); });

    // Stage 1 Listeners
    dom.btnGenerateContext.addEventListener('click', handleGenerateContext);
    dom.btnApproveContext.addEventListener('click', handleApproveContext);
    dom.btnCopyContext.addEventListener('click', () => copyToClipboard(state.docs.context, dom.btnCopyContext));
    setupEditorTabs(dom.tabContextPreview, dom.tabContextEdit, dom.contextPreviewContainer, dom.contextRawEditor, () => 'context');

    // Stage 2 Listeners
    dom.btnGenerateSpec.addEventListener('click', handleGenerateSpec);
    dom.btnApproveSpec.addEventListener('click', handleApproveSpec);
    dom.btnBackToContext.addEventListener('click', () => switchStage(1));
    dom.btnCopySpec.addEventListener('click', () => copyToClipboard(state.docs.spec, dom.btnCopySpec));
    setupEditorTabs(dom.tabSpecPreview, dom.tabSpecEdit, dom.specPreviewContainer, dom.specRawEditor, () => 'spec');

    // Stage 3 Listeners
    dom.btnGeneratePlan.addEventListener('click', handleGeneratePlan);
    dom.btnApprovePlan.addEventListener('click', handleApprovePlan);
    dom.btnBackToSpec.addEventListener('click', () => switchStage(2));
    dom.btnCopyPlan.addEventListener('click', () => copyToClipboard(state.docs.plan, dom.btnCopyPlan));
    setupEditorTabs(dom.tabPlanPreview, dom.tabPlanEdit, dom.planPreviewContainer, dom.planRawEditor, () => 'plan');

    // Stage 4 Listeners
    dom.finalFilesTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            renderFinalPreview(btn.getAttribute('data-file'));
        });
    });

    dom.btnCopyActiveFinal.addEventListener('click', () => {
        copyToClipboard(state.docs[activeFinalFile] || '', dom.btnCopyActiveFinal);
    });

    dom.btnDownloadZip.addEventListener('click', async () => {
        try {
            await downloadZipPackage({
                projectName: state.projectName,
                featureName: state.featureName,
                contextMd: state.docs.context,
                specMd: state.docs.spec,
                planMd: state.docs.plan,
                agentsMd: state.docs.agents,
                claudeMd: state.docs.claude
            });
            showAlert('Pacote ZIP baixado com sucesso contendo toda a estrutura de pastas!', 'success');
        } catch (err) {
            showAlert(`Erro ao gerar arquivo ZIP: ${err.message}`, 'error');
        }
    });
}

// Inicialização da Página
document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    updateProviderStatus();
    populateModelsDropdown();

    // Recupera dados prévios se existirem
    if (state.projectName) dom.inputProjectName.value = state.projectName;
    if (state.featureName) dom.inputFeatureName.value = state.featureName;
});
