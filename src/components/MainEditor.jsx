import React, { useState, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { ClassicEditor, Essentials, Paragraph, Bold, Italic } from 'ckeditor5';
import { TimestampPlugin } from './TimeStampClass'; // Your unchanged plugin
import EquationPlugin from './EquationPlugin';   // New EquationPlugin
import EqEditorModal from './EqEditorModal';     // Modal component
import 'ckeditor5/ckeditor5.css';

function MainEditor() {
    const [modalOpen, setModalOpen] = useState(false);
    const [editorInstance, setEditorInstance] = useState(null);

    const handleInsertEquation = useCallback((latexString) => {
        if (editorInstance) {
            editorInstance.model.change(writer => {
                const insertPosition = editorInstance.model.document.selection.getFirstPosition();
                // Insert LaTeX wrapped by delimiters $$...$$
                const latexText = `$$${latexString}$$`;
                const textNode = writer.createText(latexText);
                writer.insert(textNode, insertPosition);
            });
        }
    }, [editorInstance]);

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                config={{
                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjI1NTk5OTksImp0aSI6ImZlN2YxMzM5LTM2N2ItNDE3Mi1hOTZiLTIxYjAxMjI3NTVkYSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjU0ODI1ODE3In0.dRCuyIItJf7AXo0Lwn5-vUYEQ6uAVsjsq7R-ckvelj3xyjsMjgXjvSHsB1Rdrt46SPCjvrwd9lsZqtzfATkfGg',
                    plugins: [Essentials, Paragraph, Bold, Italic, TimestampPlugin, EquationPlugin],
                    toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'timestamp', 'insertEquation'],
                    data: '<p>Hello from CKEditor 5 in React!</p>',
                }}
                onReady={editor => {
                    setEditorInstance(editor);
                    editor.on('openEqEditor', () => setModalOpen(true));
                }}
            />
            <EqEditorModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onInsert={handleInsertEquation}
            />
        </>
    );
}

export default MainEditor;
