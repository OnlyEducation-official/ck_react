// src/plugins/KaTeXRenderPlugin.js
import { Plugin, Widget, toWidget } from 'ckeditor5';
import { renderLatexWithKatex } from './renderLatexWithKatex';

export default class KaTeXRenderPlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;

        // === 1) Schema: block + inline ===
        editor.model.schema.register('mathBlock', {
            allowWhere: '$block',
            isObject: true,
            allowAttributes: ['latex'],
        });

        editor.model.schema.register('mathInline', {
            allowWhere: '$text',
            isInline: true,
            isObject: true,
            allowAttributes: ['latex'],
        });

        // === 2) Editing downcast (model → editing view) ===

        // Block
        editor.conversion.for('editingDowncast').elementToElement({
            model: 'mathBlock',
            view: (modelItem, { writer }) => {
                const latex = modelItem.getAttribute('latex') || '';
                const html = renderLatexWithKatex(latex, { displayMode: true });

                const container = writer.createContainerElement('div', { class: 'math-block' });

                const raw = writer.createRawElement(
                    'span',
                    { class: 'katex-render' },
                    (domElement) => {
                        domElement.innerHTML = html;
                        domElement.style.cursor = 'pointer';
                        domElement.addEventListener('click', () => {
                            editor.fire('openEqEditor', {
                                latex,
                                modelElement: modelItem,
                                displayMode: true, // block
                            });
                        });
                    }
                );

                writer.insert(writer.createPositionAt(container, 0), raw);
                return toWidget(container, writer, { label: 'Math block' });
            },
        });

        // Inline
        editor.conversion.for('editingDowncast').elementToElement({
            model: 'mathInline',
            view: (modelItem, { writer }) => {
                const latex = modelItem.getAttribute('latex') || '';
                const html = renderLatexWithKatex(latex, { displayMode: false });

                const container = writer.createContainerElement('span', { class: 'math-inline' });

                const raw = writer.createRawElement(
                    'span',
                    { class: 'katex-inline' },
                    (domElement) => {
                        domElement.innerHTML = html;
                        domElement.style.cursor = 'pointer';
                        domElement.addEventListener('click', () => {
                            editor.fire('openEqEditor', {
                                latex,
                                modelElement: modelItem,
                                displayMode: false, // inline
                            });
                        });
                    }
                );

                writer.insert(writer.createPositionAt(container, 0), raw);
                return toWidget(container, writer, { label: 'Inline math' });
            },
        });

        // === 3) Attribute re-render on latex changes (live) ===
        const rerenderLatex = (evt, data, conversionApi) => {
            const { writer, mapper } = conversionApi;
            const modelElement = data.item;

            const viewElement = mapper.toViewElement(modelElement);
            if (!viewElement) return;

            const container = viewElement;
            const rawElement = container.getChild(0);
            if (!rawElement) return;

            const isBlock = modelElement.name === 'mathBlock';
            const newLatex = data.attributeNewValue || '';
            const newHtml = renderLatexWithKatex(newLatex, { displayMode: isBlock });

            writer.remove(rawElement);

            const newRaw = writer.createRawElement(
                'span',
                { class: isBlock ? 'katex-render' : 'katex-inline' },
                (domElement) => {
                    domElement.innerHTML = newHtml;
                    domElement.style.cursor = 'pointer';
                    domElement.addEventListener('click', () => {
                        editor.fire('openEqEditor', {
                            latex: newLatex,
                            modelElement,
                            displayMode: isBlock,
                        });
                    });
                }
            );

            writer.insert(writer.createPositionAt(container, 0), newRaw);
        };

        editor.conversion.for('editingDowncast').add((dispatcher) => {
            dispatcher.on('attribute:latex:mathBlock', rerenderLatex);
            dispatcher.on('attribute:latex:mathInline', rerenderLatex);
        });

        // === 4) Data downcast (model → saved HTML) ===

        // Block → <div class="math-block" data-latex="...">
        editor.conversion.for('dataDowncast').elementToElement({
            model: 'mathBlock',
            view: (modelItem, { writer }) => {
                const latex = modelItem.getAttribute('latex') || '';
                return writer.createContainerElement('div', {
                    class: 'math-block',
                    'data-latex': latex,
                });
            },
        });

        // Inline → <span class="math-inline" data-latex="...">
        editor.conversion.for('dataDowncast').elementToElement({
            model: 'mathInline',
            view: (modelItem, { writer }) => {
                const latex = modelItem.getAttribute('latex') || '';
                return writer.createContainerElement('span', {
                    class: 'math-inline',
                    'data-latex': latex,
                });
            },
        });

        // === 5) Upcast (HTML → model) ===

        // <div class="math-block" data-latex="...">
        editor.conversion.for('upcast').elementToElement({
            view: { name: 'div', classes: 'math-block' },
            model: (viewElement, { writer }) => {
                const latex = viewElement.getAttribute('data-latex');
                return writer.createElement('mathBlock', { latex });
            },
        });

        // <span class="math-inline" data-latex="...">
        editor.conversion.for('upcast').elementToElement({
            view: { name: 'span', classes: 'math-inline' },
            model: (viewElement, { writer }) => {
                const latex = viewElement.getAttribute('data-latex');
                return writer.createElement('mathInline', { latex });
            },
        });
    }
}
