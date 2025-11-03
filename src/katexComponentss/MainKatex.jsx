import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// Utility function to clean LaTeX input
function cleanLatexInput(input) {
    if (!input || typeof input !== 'string') return '';

    let latex = input.trim();

    // Remove display math delimiters
    latex = latex.replace(/^\\\[/, '').replace(/\\\]$/, '');
    latex = latex.replace(/^\$\$/, '').replace(/\$\$$/, '');
    latex = latex.replace(/^\$/, '').replace(/\$$/, '');

    // Remove trailing '\\' before \end{...} to avoid KaTeX errors
    latex = latex.replace(/\\\\(?=\s*\\end\{[a-zA-Z]*\})/g, '');

    return latex.trim();
}

function LatexRenderer({ latex }) {
    const cleanedLatex = cleanLatexInput(latex);

    let html = '';
    try {
        html = katex.renderToString(cleanedLatex, {
            throwOnError: false,
            displayMode: true,
        });
    } catch (error) {
        html = `<span style="color: red;">Error rendering LaTeX</span>`;
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function App() {
    const [latex, setLatex] = useState("\\[\\begin{Bmatrix}x&z\\\\x&z\\\\x&z\\\\\\end{Bmatrix}\\left[\\begin{Bmatrix}x&z\\\\x&z\\\\x&z\\\\\\end{Bmatrix}\\right]\\]");

    return (
        <div style={{ padding: 20 }}>
            <h2>Test LaTeX Renderer</h2>
            <textarea
                style={{ width: '100%', height: 100, marginBottom: 20 }}
                value={latex}
                onChange={(e) => setLatex(e.target.value)}
            />
            <h3>Rendered Output:</h3>
            <LatexRenderer latex={latex} />
        </div>
    );
}
