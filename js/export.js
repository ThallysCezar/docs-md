/**
 * Módulo de exportação de arquivos e geração de pacote ZIP
 */

export function slugify(text) {
    return (text || 'feature')
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

export async function downloadZipPackage({
    projectName = 'meu-projeto',
    featureName = 'nova-feature',
    contextMd = '',
    specMd = '',
    planMd = '',
    agentsMd = '',
    claudeMd = ''
}) {
    if (typeof JSZip === 'undefined') {
        throw new Error('A biblioteca JSZip não foi carregada. Verifique sua conexão.');
    }

    const zip = new JSZip();
    const featureSlug = slugify(featureName);

    // 1. Arquivos de regras na raiz
    if (agentsMd) zip.file('AGENTS.md', agentsMd);
    if (claudeMd) zip.file('CLAUDE.md', claudeMd);

    // 2. Pasta docs/
    const docsFolder = zip.folder('docs');
    if (contextMd && docsFolder) {
        docsFolder.file('Context.md', contextMd);
    }

    // 3. Pasta docs/specs/<feature>/
    if (docsFolder) {
        const specsFolder = docsFolder.folder('specs');
        if (specsFolder) {
            const featureFolder = specsFolder.folder(featureSlug);
            if (featureFolder) {
                if (specMd) featureFolder.file('Spec.md', specMd);
                if (planMd) featureFolder.file('Plan.md', planMd);
            }
        }
    }

    // Gerar e disparar download
    const blob = await zip.generateAsync({ type: 'blob' });
    const fileName = `docs-${slugify(projectName)}-${featureSlug}.zip`;

    if (typeof saveAs !== 'undefined') {
        saveAs(blob, fileName);
    } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export async function copyToClipboard(text, buttonElement) {
    try {
        await navigator.clipboard.writeText(text);
        if (buttonElement) {
            const originalText = buttonElement.innerHTML;
            buttonElement.innerHTML = `
                <svg class="w-4 h-4 inline mr-1 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg> Copiado!
            `;
            buttonElement.classList.add('bg-emerald-800/50', 'text-emerald-300');
            setTimeout(() => {
                buttonElement.innerHTML = originalText;
                buttonElement.classList.remove('bg-emerald-800/50', 'text-emerald-300');
            }, 2000);
        }
    } catch (err) {
        alert('Não foi possível copiar automaticamente para a área de transferência.');
    }
}
