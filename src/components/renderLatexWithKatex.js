// src/utils/renderLatexWithKatex.js
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Safely render LaTeX to KaTeX HTML.
 */
export function renderLatexWithKatex(latex = '') {
    if (typeof latex !== 'string') return '';

    let cleaned = latex
        .trim()
        .replace(/^(\$\$|\\\[)/, '')
        .replace(/(\$\$|\\\])$/, '');

    try {
        return katex.renderToString(cleaned, {
            throwOnError: false,
            displayMode: true,
        });
    } catch (err) {
        console.error('KaTeX render error:', err);
        return `<span style="color:red;">Invalid LaTeX</span>`;
    }
}