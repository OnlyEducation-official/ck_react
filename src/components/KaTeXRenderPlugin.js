// src/plugins/KaTeXRenderPlugin.js
import { Plugin, Widget, toWidget } from 'ckeditor5';
import { renderLatexWithKatex } from './renderLatexWithKatex';

export default class KaTeXRenderPlugin extends Plugin {
    static get requires() {
        return [Widget];
    }

    init() {
        const editor = this.editor;

        // --- 1. Define a math model element
        editor.model.schema.register('mathBlock', {
            allowWhere: '$block',
            isObject: true,
            allowAttributes: ['latex'],
        });

        // --- 2. Downcast (model → editing view)
        editor.conversion.for('editingDowncast').elementToElement({
            model: 'mathBlock',
            view: (modelItem, { writer }) => {
                const latex = modelItem.getAttribute('latex') || '';
                const html = renderLatexWithKatex(latex);

                const container = writer.createContainerElement('div', {
                    class: 'math-block',
                });

                const raw = writer.createRawElement(
                    'span',
                    { class: 'katex-render' },
                    (domElement) => {
                        domElement.innerHTML = html;

                        // Add click event listener with cursor pointer
                        domElement.style.cursor = 'pointer';
                        domElement.addEventListener('click', () => {
                            // Pass both latex and the model element for editing
                            editor.fire('openEqEditor', {
                                latex,
                                modelElement: modelItem
                            });
                        });
                    }
                );

                writer.insert(writer.createPositionAt(container, 0), raw);
                return toWidget(container, writer, { label: 'Math block' });
            },
        });

        // --- 2b. Listen for attribute changes and trigger re-render
        editor.conversion.for('editingDowncast').add(dispatcher => {
            dispatcher.on('attribute:latex:mathBlock', (evt, data, conversionApi) => {
                const { writer, mapper } = conversionApi;
                const modelElement = data.item;

                // Get the view element
                const viewElement = mapper.toViewElement(modelElement);
                if (!viewElement) return;

                // Find the container and raw element
                const container = viewElement;
                const rawElement = container.getChild(0);

                if (rawElement) {
                    // Re-render the raw element with new latex
                    const newLatex = data.attributeNewValue || '';
                    const newHtml = renderLatexWithKatex(newLatex);

                    writer.remove(rawElement);

                    const newRaw = writer.createRawElement(
                        'span',
                        { class: 'katex-render' },
                        (domElement) => {
                            domElement.innerHTML = newHtml;
                            domElement.style.cursor = 'pointer';
                            domElement.addEventListener('click', () => {
                                editor.fire('openEqEditor', {
                                    latex: newLatex,
                                    modelElement: modelElement
                                });
                            });
                        }
                    );

                    writer.insert(writer.createPositionAt(container, 0), newRaw);
                }
            });
        });

        // --- 3. Downcast for data (model → saved HTML)
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

        // --- 4. Upcast (HTML → model)
        editor.conversion.for('upcast').elementToElement({
            view: {
                name: 'div',
                classes: 'math-block',
            },
            model: (viewElement, { writer }) => {
                const latex = viewElement.getAttribute('data-latex');
                return writer.createElement('mathBlock', { latex });
            },
        });
    }
}