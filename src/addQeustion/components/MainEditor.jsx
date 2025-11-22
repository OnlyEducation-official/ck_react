import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Essentials, Paragraph, Bold } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";

const MainEditor = ({ name, setValue, watch, value, debounceMs = 400 }) => {
  // use watch if provided, else fallback to value prop
  const currentValue = typeof watch === "function" ? watch(name) : value;
  const latestValue = useRef(currentValue ?? "");
  const debounceTimer = useRef(null);

  useEffect(() => {
    latestValue.current = currentValue ?? "";
  }, [currentValue]);

  const handleEditorChange = (editorData) => {
    latestValue.current = editorData;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      // ✅ Debounced update to React Hook Form
      setValue(name, latestValue.current, { shouldValidate: true });
    }, debounceMs);
  };

  return (
    <div>
      <CKEditor
        editor={ClassicEditor}
        config={{
          licenseKey: import.meta.env.VITE_CKEDITOR,
          plugins: [Essentials, Paragraph, Bold, MathType],
          toolbar: ["undo", "redo", "|", "bold", "MathType"],
        }}
        data={currentValue ?? ""}
        onChange={(_, editor) => {
          const data = editor.getData();
          handleEditorChange(data);
        }}
      />
    </div>
  );
};

export default React.memo(MainEditor);
