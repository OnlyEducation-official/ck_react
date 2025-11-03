// src/MainEditor.jsx
import React, { useState, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    Italic,
    GeneralHtmlSupport,
    List,
    ListUI,
    ListProperties,
} from 'ckeditor5';

import EquationPlugin from './EquationPlugin';
import KaTeXRenderPlugin from './KaTeXRenderPlugin';
import EqEditorModal from './EqEditorModal';
import 'ckeditor5/ckeditor5.css';

function MainEditor() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [currentLatex, setCurrentLatex] = useState('');
    const [editingElement, setEditingElement] = useState(null);
    const [modalDisplayMode, setModalDisplayMode] = useState(false); // false=inline, true=block

    const handleInsertOrUpdateEquation = useCallback(
        (latexString, displayMode = false) => {
            if (!editorInstance) return;

            editorInstance.model.change((writer) => {
                // UPDATE existing
                if (editingElement) {
                    const isEditingBlock = editingElement.name === 'mathBlock';
                    const wantsBlock = displayMode === true;

                    // If mode didn't change: just update latex
                    if (isEditingBlock === wantsBlock) {
                        writer.setAttribute('latex', latexString, editingElement);
                    } else {
                        // Mode changed: replace element with the other type
                        const newElementName = wantsBlock ? 'mathBlock' : 'mathInline';
                        const newElement = writer.createElement(newElementName, { latex: latexString });

                        // Insert new element next to the old one, then remove old
                        const positionAfter = writer.createPositionAfter(editingElement);
                        writer.insert(newElement, positionAfter);
                        writer.remove(editingElement);

                        // Place selection after new element
                        writer.setSelection(newElement, 'after');
                    }
                } else {
                    // INSERT new
                    const selection = editorInstance.model.document.selection;
                    const position = selection.getFirstPosition();
                    const elementName = displayMode ? 'mathBlock' : 'mathInline';
                    const element = writer.createElement(elementName, { latex: latexString });
                    editorInstance.model.insertContent(element, position);
                }
            });

            // Reset state
            setEditingElement(null);
            setCurrentLatex('');
            setModalOpen(false);
        },
        [editorInstance, editingElement]
    );

    const handleModalClose = useCallback(() => {
        setModalOpen(false);
        setCurrentLatex('');
        setEditingElement(null);
    }, []);

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                className="my-editor"
                config={{
                    // Your license key here
                    licenseKey:
                        'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjI1NTk5OTksImp0aSI6ImZlN2YxMzM5LTM2N2ItNDE3Mi1hOTZiLTIxYjAxMjI3NTVkYSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjU0ODI1ODE3In0.dRCuyIItJf7AXo0Lwn5-vUYEQ6uAVsjsq7R-ckvelj3xyjsMjgXjvSHsB1Rdrt46SPCjvrwd9lsZqtzfATkfGg',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        List,
                        ListUI,
                        ListProperties,
                        EquationPlugin,
                        GeneralHtmlSupport,
                        KaTeXRenderPlugin,
                    ],
                    toolbar: [
                        'undo',
                        'redo',
                        '|',
                        'bold',
                        '|',
                        'italic',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'insertEquation',
                    ],
                    list: {
                        properties: {
                            styles: true,
                            startIndex: true,
                            reversed: true,
                        },
                    },
                    htmlSupport: {
                        allow: [
                            {
                                name: /.*/,
                                attributes: true,
                                classes: true,
                                styles: true,
                            },
                        ],
                    },
                    data: '<p>Type text and insert equations inline or as blocks.</p>',
                }}
                onReady={(editor) => {
                    setEditorInstance(editor);

                    // React to our custom event from plugin/buttons
                    editor.on('openEqEditor', (evt, data = {}) => {
                        setCurrentLatex(data.latex || '');
                        setEditingElement(data.modelElement || null);
                        setModalDisplayMode(!!data.displayMode); // false=inline, true=block
                        setModalOpen(true);
                    });
                }}
            />

            {/* Modal with mode control */}
            <EqEditorModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onInsert={handleInsertOrUpdateEquation}
                initialLatex={currentLatex}
                isEditing={!!editingElement}
                displayMode={modalDisplayMode} // pre-fill mode
            />
        </>
    );
}

export default MainEditor;
