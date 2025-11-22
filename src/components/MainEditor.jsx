// src/MainEditor.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

function MainEditor({ docId, initialHTML, onChange }) {
    // ===== Modal state (unchanged behavior) =====
    const [modalOpen, setModalOpen] = useState(false);
    const [currentLatex, setCurrentLatex] = useState('');
    const [editingElement, setEditingElement] = useState(null);
    const [modalDisplayMode, setModalDisplayMode] = useState(false); // false=inline, true=block

    // ===== Refs for semi-controlled integration =====
    const editorRef = useRef(null);
    const debounceTimerRef = useRef(null);
    const isSettingDataRef = useRef(false);
    const lastDocIdRef = useRef(null);
    const isMountedRef = useRef(false);

    // ===== Config memoized once to avoid remounts (Req. 8) =====
    const editorConfig = useMemo(
        () => ({
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
            // IMPORTANT: do NOT pass initial data here; we set it programmatically
        }),
        []
    );

    // ===== Debounce + Flush (Req. 3, 4, 9) =====
    const flushPendingChange = useCallback(() => {
        if (!editorRef.current) return;
        // If we are in the middle of programmatic setData, ignore
        if (isSettingDataRef.current) return;

        const html = editorRef.current.getData();
        if (typeof onChange === 'function') {
            onChange(html, { docId });
        }
    }, [docId, onChange]);

    const scheduleChange = useCallback(() => {
        if (isSettingDataRef.current) return; // ignore programmatic updates
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            debounceTimerRef.current = null;
            flushPendingChange();
        }, 800);
    }, [flushPendingChange]);

    // ===== Handle editor ready (Req. 3, 9, 10) =====
    const handleEditorReady = useCallback((editor) => {
        editorRef.current = editor;

        // Initialize with initialHTML on mount (Req. 2)
        isSettingDataRef.current = true;
        editor.setData(initialHTML || '');
        isSettingDataRef.current = false;
        lastDocIdRef.current = docId;
        isMountedRef.current = true;

        // Hook change:data (debounced) (Req. 3)
        editor.model.document.on('change:data', () => {
            scheduleChange();
        });

        // Flush on blur (Req. 9)
        editor.editing.view.document.on('blur', () => {
            flushPendingChange();
        });

        // Bridge your custom event from EquationPlugin to modal (unchanged)
        editor.on('openEqEditor', (evt, data = {}) => {
            setCurrentLatex(data.latex || '');
            setEditingElement(data.modelElement || null);
            setModalDisplayMode(!!data.displayMode);
            setModalOpen(true);
        });
    }, [docId, initialHTML, scheduleChange, flushPendingChange]);

    // ===== React to docId changes (Req. 2, 6, 7) =====
    useEffect(() => {
        if (!editorRef.current) return;

        // If docId changed, flush pending changes of old doc, then load new content
        const prevDocId = lastDocIdRef.current;
        if (isMountedRef.current && prevDocId !== docId) {
            // Flush outgoing doc
            flushPendingChange();

            // Load new content safely
            isSettingDataRef.current = true;
            editorRef.current.setData(initialHTML || '');
            isSettingDataRef.current = false;

            // Update marker
            lastDocIdRef.current = docId;
        }
    }, [docId, initialHTML, flushPendingChange]);

    // ===== Cleanup on unmount (Req. 9) =====
    useEffect(() => {
        return () => {
            // Flush any last change
            flushPendingChange();

            // Clear timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }

            // Destroy editor instance ref (wrapper will handle editor.destroy())
            editorRef.current = null;
            isMountedRef.current = false;
        };
    }, [flushPendingChange]);

    // ===== Equation insert/update (Req. 10) - unchanged logic, but uses editorRef =====
    const handleInsertOrUpdateEquation = useCallback(
        (latexString, displayMode = false) => {
            const editor = editorRef.current;
            if (!editor) return;

            editor.model.change((writer) => {
                if (editingElement) {
                    const isEditingBlock = editingElement.name === 'mathBlock';
                    const wantsBlock = displayMode === true;

                    if (isEditingBlock === wantsBlock) {
                        writer.setAttribute('latex', latexString, editingElement);
                    } else {
                        const newElementName = wantsBlock ? 'mathBlock' : 'mathInline';
                        const newElement = writer.createElement(newElementName, { latex: latexString });

                        const positionAfter = writer.createPositionAfter(editingElement);
                        writer.insert(newElement, positionAfter);
                        writer.remove(editingElement);

                        writer.setSelection(newElement, 'after');
                    }
                } else {
                    const selection = editor.model.document.selection;
                    const position = selection.getFirstPosition();
                    const elementName = displayMode ? 'mathBlock' : 'mathInline';
                    const element = writer.createElement(elementName, { latex: latexString });
                    editor.model.insertContent(element, position);
                }
            });

            // Local modal reset
            setEditingElement(null);
            setCurrentLatex('');
            setModalOpen(false);
            // No explicit flush here; the model change will trigger change:data → debounce
        },
        [editingElement]
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
                config={editorConfig}
                onReady={handleEditorReady}
            // CRITICAL: do NOT pass "data" prop (we setData programmatically to avoid remounts)
            />

            <EqEditorModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onInsert={handleInsertOrUpdateEquation}
                initialLatex={currentLatex}
                isEditing={!!editingElement}
                displayMode={modalDisplayMode}
            />
        </>
    );
}

export default MainEditor;
