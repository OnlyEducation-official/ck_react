// src/MainEditor.jsx
import React, { useState, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Essentials,
    Paragraph,
    Bold,
    // Italic,
    // GeneralHtmlSupport,
    // List,
    // ListUI,
    // ListProperties,
} from 'ckeditor5';

import EquationPlugin from './EquationPlugin';
import KaTeXRenderPlugin from './KaTeXRenderPlugin';
import EqEditorModal from './EqEditorModal';
import 'ckeditor5/ckeditor5.css';
import MathType from '@wiris/mathtype-ckeditor5/dist/index.js';

function MainEditor() {

    const [editorData, setEditorData] = useState('<p>Type text and insert equations inline or as blocks.</p>');
    console.log('editorData: ', editorData);

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                className="my-editor"
                config={{
                    // Your license key here
                    licenseKey:
                        'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjM5NDIzOTksImp0aSI6ImZjZDk1ZmIxLTI5NjUtNDFkNy04YTkwLWMyNGJiNWEwNTQ3OSIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImU5ZGFkODM1In0.Bp6ywOhDzf4Ltf8tylcPS_2zQOGEJ35tKQ7xQ4rzpSaO4r6tzhW4ND_qi0OOdJywWsby3DixnnBUlKk2LLwrsw',
                    plugins: [
                        Essentials,
                        Paragraph,
                        Bold,
                        MathType,
                    ],
                    toolbar: [
                        'undo',
                        'redo',
                        '|',
                        'bold',
                        'MathType',
                        'ChemType',
                    ],

                    data: '<p>Type text and insert equations inline or as blocks.</p>',
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    setEditorData(data);
                    console.log('Editor data:', data);
                }}

            />


        </>
    );
}

export default MainEditor;
