// src/plugins/renderLatexWithKatex.js
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Safely render LaTeX to KaTeX HTML.
 * @param {string} latex
 * @param {{displayMode?: boolean}} options
 */
export function renderLatexWithKatex(latex = '', options = {}) {
    const { displayMode = true } = options;

    if (typeof latex !== 'string') return '';

    let cleaned = latex
        .trim()
        .replace(/^(\$\$|\\\[)/, '')
        .replace(/(\$\$|\\\])$/, '');

    try {
        return katex.renderToString(cleaned, {
            throwOnError: false,
            displayMode,
        });
    } catch (err) {
        console.error('KaTeX render error:', err);
        return `<span style="color:red;">Invalid LaTeX</span>`;
    }
}
