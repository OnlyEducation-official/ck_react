// EqEditorModal.jsx
import React, { useEffect } from 'react';

function EqEditorModal({ isOpen, onClose, onInsert }) {
    useEffect(() => {
        if (isOpen && window.EqEditor) {
            const textarea = window.EqEditor.TextArea.link('latexInput')
                .addOutput(new window.EqEditor.Output('output'))
                .addHistoryMenu(new window.EqEditor.History('history'));

            window.EqEditor.Toolbar.link('toolbar').addTextArea(textarea);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInsert = () => {
        const latexContent = document.getElementById('latexInput')?.textContent || '';
        if (latexContent.trim()) {
            onInsert(latexContent.trim());
        }
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999
        }}>
            <div style={{ background: '#fff', padding: 20, width: 600, maxHeight: '80vh', overflowY: 'auto' }}>
                <div id="equation-editor">
                    <div id="history"></div>
                    <div id="toolbar"></div>
                    <div id="latexInput" style={{ border: '1px solid #ccc', minHeight: '100px', padding: 10 }} placeholder="Write Equation here..."></div>
                    <div id="equation-output" style={{ marginTop: 10 }}>
                        <img id="output" alt="Equation output" />
                    </div>
                </div>
                <button onClick={handleInsert} style={{ marginRight: 10 }}>Insert LaTeX</button>
                <button onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
}

export default EqEditorModal;
