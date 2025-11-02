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
} from 'ckeditor5';
import { TimestampPlugin } from './TimeStampClass';
import EquationPlugin from './EquationPlugin';
import KaTeXRenderPlugin from './KaTeXRenderPlugin';
import EqEditorModal from './EqEditorModal';
import 'ckeditor5/ckeditor5.css';

function MainEditor() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);
    const [currentLatex, setCurrentLatex] = useState('');
    const [editingElement, setEditingElement] = useState(null);

    const handleInsertOrUpdateEquation = useCallback(
        (latexString) => {
            if (!editorInstance) return;

            editorInstance.model.change((writer) => {
                if (editingElement) {
                    // Update existing equation
                    writer.setAttribute('latex', latexString, editingElement);
                } else {
                    // Insert new equation
                    const position =
                        editorInstance.model.document.selection.getFirstPosition();
                    const element = writer.createElement('mathBlock', {
                        latex: latexString,
                    });
                    editorInstance.model.insertContent(element, position);
                }
            });

            // Reset editing state
            setEditingElement(null);
            setCurrentLatex('');
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
                config={{
                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjI1NTk5OTksImp0aSI6ImZlN2YxMzM5LTM2N2ItNDE3Mi1hOTZiLTIxYjAxMjI3NTVkYSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjU0ODI1ODE3In0.dRCuyIItJf7AXo0Lwn5-vUYEQ6uAVsjsq7R-ckvelj3xyjsMjgXjvSHsB1Rdrt46SPCjvrwd9lsZqtzfATkfGg',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        Italic,
                        TimestampPlugin,
                        EquationPlugin,
                        GeneralHtmlSupport,
                        KaTeXRenderPlugin,
                    ],
                    toolbar: [
                        'undo',
                        'redo',
                        '|',
                        'bold',
                        'italic',
                        'timestamp',
                        'insertEquation',
                    ],
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
                    data: '<p>Hello from CKEditor 5 in React!</p>',
                }}
                onReady={(editor) => {
                    setEditorInstance(editor);
                    editor.on('openEqEditor', (evt, data) => {
                        // Set the latex and model element for editing
                        setCurrentLatex(data?.latex || '');
                        setEditingElement(data?.modelElement || null);
                        setModalOpen(true);
                    });
                }}
            />
            <EqEditorModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onInsert={handleInsertOrUpdateEquation}
                initialLatex={currentLatex}
                isEditing={!!editingElement}
            />
        </>
    );
}

export default MainEditor;