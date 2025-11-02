// EqEditorModal.jsx
import React, { useEffect } from 'react';

function EqEditorModal({ isOpen, onClose, onInsert, initialLatex = '', isEditing = false }) {
    useEffect(() => {
        if (isOpen && window.EqEditor) {
            const textarea = window.EqEditor.TextArea.link('latexInput')
                .addOutput(new window.EqEditor.Output('output'))
                .addHistoryMenu(new window.EqEditor.History('history'));

            window.EqEditor.Toolbar.link('toolbar').addTextArea(textarea);

            // Set initial latex if provided (for editing)
            if (initialLatex) {
                const latexInputElement = document.getElementById('latexInput');
                if (latexInputElement) {
                    latexInputElement.textContent = initialLatex;
                    // Trigger EqEditor to update the output preview
                    const event = new Event('input', { bubbles: true });
                    latexInputElement.dispatchEvent(event);
                }
            }
        }
    }, [isOpen, initialLatex]);

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
            <div style={{ background: '#fff', padding: 20, width: 600, maxHeight: '80vh', overflowY: 'auto', borderRadius: 8 }}>
                <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Equation' : 'Insert Equation'}</h3>
                <div id="equation-editor">
                    <div id="history"></div>
                    <div id="toolbar"></div>
                    <div
                        id="latexInput"
                        contentEditable
                        style={{
                            border: '1px solid #ccc',
                            minHeight: '100px',
                            padding: 10,
                            marginTop: 10,
                            backgroundColor: '#f9f9f9'
                        }}
                        placeholder="Write Equation here..."
                    ></div>
                    <div id="equation-output" style={{ marginTop: 10 }}>
                        <img id="output" alt="Equation output" />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <button
                        onClick={handleInsert}
                        style={{
                            marginRight: 10,
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        {isEditing ? 'Update' : 'Insert'}
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EqEditorModal;