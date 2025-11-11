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
          licenseKey:
            "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjM5NDIzOTksImp0aSI6IjY3NGFhYTJiLTNmNmQtNDhiYi05YjhjLWU0OWIwZTY4NGNlNyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjgwNWMyYzAxIn0.andZKBtk2kyMsx53jk3RIaBV0ZhZ0CUEipALkY5u00UWPA4ZkRLRNYJY0f4FfIlNbYCEd34Yi6ZmywI81_H7qw",
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
    </>
  );
}

export default MainEditor;
