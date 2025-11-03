// src/EqEditorModal.jsx
import React, { useEffect, useRef, useState } from 'react';

function EqEditorModal({
  isOpen,
  onClose,
  onInsert,
  initialLatex = '',
  isEditing = false,
  displayMode: initialDisplayMode = false, // false=inline, true=block
}) {
  const textareaRef = useRef(null);
  const outputRef = useRef(null);
  const toolbarRef = useRef(null);
  const [displayMode, setDisplayMode] = useState(initialDisplayMode);

  useEffect(() => {
    if (!isOpen || !window.EqEditor) return;

    const textarea = window.EqEditor.TextArea.link('latexInput');
    const output = window.EqEditor.Output.link('output', 'url');
    const toolbar = window.EqEditor.Toolbar.link('toolbar');

    textarea.addOutput(output).addHistoryMenu(new window.EqEditor.History('history'));
    toolbar.addTextArea(textarea);

    textareaRef.current = textarea;
    outputRef.current = output;
    toolbarRef.current = toolbar;

    if (initialLatex) {
      textarea.clear();
      textarea.insert(initialLatex);
      output.updateOutput();
    }

    setDisplayMode(initialDisplayMode);

    return () => {
      textareaRef.current = null;
      outputRef.current = null;
      toolbarRef.current = null;
    };
  }, [isOpen, initialLatex, initialDisplayMode]);

  if (!isOpen) return null;

  const handleInsert = () => {
    const latex = textareaRef.current?.getTextArea()?.textContent?.trim() || '';
    if (latex) onInsert(latex, displayMode);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 20,
          width: '780px',
          maxHeight: '80vh',
          overflowY: 'auto',
          borderRadius: 8,
        }}
      >
        <h3 style={{ marginTop: 0, marginBlockEnd: 8 }}>
          {isEditing ? 'Edit Equation' : 'Insert Equation'}
        </h3>

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
              backgroundColor: '#f9f9f9',
              whiteSpace: 'pre-wrap',
              overflow: 'auto',
              resize: 'vertical',
            }}
            placeholder="Write Equation here..."
            spellCheck={false}
            autoComplete="off"
            tabIndex={0}
          />
          <div id="equation-output" style={{ marginTop: 10 }}>
            <img id="output" alt="Equation output" />
          </div>
        </div>

        {/* Mode toggle */}
        <div style={{ marginTop: 15 }}>
          <label style={{ userSelect: 'none', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={displayMode}
              onChange={(e) => setDisplayMode(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            Display block
          </label>
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
              cursor: 'pointer',
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
              cursor: 'pointer',
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
