// EqEditorModal.jsx
import React, { useEffect, useRef } from 'react';

function EqEditorModal({ isOpen, onClose, onInsert, initialLatex = '', isEditing = false }) {
    const textAreaRef = useRef(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (!isOpen || !window.EqEditor) return;

        // Prevent multiple initializations
        if (hasInitialized.current) return;

        // Initialize EqEditor once
        const initTimeout = setTimeout(() => {
            const textarea = window.EqEditor.TextArea.link('latexInput')
                .addOutput(new window.EqEditor.Output('output'))
                .addHistoryMenu(new window.EqEditor.History('history'));

            window.EqEditor.Toolbar.link('toolbar').addTextArea(textarea);
            textAreaRef.current = textarea;
            hasInitialized.current = true;

            // Set initial latex after initialization
            const latexTimeout = setTimeout(() => {
                const latexInput = document.getElementById('latexInput');
                if (latexInput) {
                    if (initialLatex) {
                        latexInput.textContent = initialLatex;
                    }
                    // Trigger input event to update preview
                    const event = new Event('input', { bubbles: true });
                    latexInput.dispatchEvent(event);

                    // Force focus to ensure editor is ready
                    latexInput.focus();

                    // If there's content, move cursor to end
                    if (initialLatex) {
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.selectNodeContents(latexInput);
                        range.collapse(false);
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }
            }, 150);

            return () => clearTimeout(latexTimeout);
        }, 100);

        return () => {
            clearTimeout(initTimeout);
            hasInitialized.current = false;
        };
    }, [isOpen]); // Only run when modal opens

    if (!isOpen) return null;

    const handleInsert = () => {
        const latexContent = document.getElementById('latexInput')?.textContent || '';
        if (latexContent.trim()) {
            onInsert(latexContent.trim());
        }
        onClose();
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 9999
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                style={{ background: '#fff', padding: 20, width: 600, maxHeight: '80vh', overflowY: 'auto', borderRadius: 8 }}
            >
                <h3 style={{ marginTop: 0 }}>{isEditing ? 'Edit Equation' : 'Insert Equation'}</h3>
                <div id="equation-editor">
                    <div id="history"></div>
                    <div id="toolbar"></div>
                    <div
                        id="latexInput"
                        contentEditable
                        suppressContentEditableWarning
                        style={{
                            border: '1px solid #ccc',
                            minHeight: '100px',
                            padding: 10,
                            marginTop: 10,
                            backgroundColor: '#f9f9f9',
                            outline: 'none',
                            whiteSpace: 'pre-wrap',
                            wordWrap: 'break-word'
                        }}
                        data-placeholder="Write Equation here..."
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
                        onClick={handleCancel}
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