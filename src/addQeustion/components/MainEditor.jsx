// src/MainEditor.jsx
import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
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
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";

function MainEditor() {
  const [editorData, setEditorData] = useState(
    "<p>Type text and insert equations inline or as blocks.</p>"
  );
  console.log("editorData: ", editorData);
  return (
    <>
      <CKEditor
        editor={ClassicEditor}
        className="my-editor"
        config={{
          // Your license key here
          licenseKey: import.meta.env.VITE_CKEDITOR,
          plugins: [Essentials, Paragraph, Bold, MathType],
          toolbar: [
            "undo",
            "redo",
            "|",
            "bold",
            "MathType",
            "insertInlineFormula", // Inline equation editor
            "insertBlockFormula",
            // 'ChemType',
          ],

          data: "<p>Type text and insert equations inline or as blocks.</p>",
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          setEditorData(data);
          console.log("Editor data:", data);
        }}
      />
        <pre>
          {JSON.stringify(editorData, null, 2)}
          </pre>
    </>
  );
}

export default MainEditor;
