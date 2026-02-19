import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import type {
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
  Path,
} from "react-hook-form";
import type { Editor as TinyMCEEditor } from "tinymce";

type Props<T extends FieldValues> = {
  name: Path<T>;
  setValue: UseFormSetValue<T>;
  watch?: UseFormWatch<T>;
  value?: string;
  height?: number;
  debounceMs?: number;
};

export default function EditorComponent<T extends FieldValues>({
  name,
  setValue,
  watch,
  value,
  height = 500,
  debounceMs = 400,
}: Props<T>) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const latestValue = useRef<string>("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Same logic as MainEditor
  const currentValue = typeof watch === "function" ? watch(name) : value;

  useEffect(() => {
    latestValue.current = currentValue ?? "";

    if (editorRef.current) {
      const editor = editorRef.current;
      if (editor.getContent() !== latestValue.current) {
        editor.setContent(latestValue.current);
      }
    }
  }, [currentValue]);

  const handleEditorChange = (html: string) => {
    latestValue.current = html;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setValue(name, latestValue.current as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }, debounceMs);
  };

  return (
    <Editor
      onInit={(_, editor) => {
        editorRef.current = editor;
        editor.setContent(latestValue.current ?? "");
      }}
      initialValue={currentValue ?? ""}
      onEditorChange={handleEditorChange}
      licenseKey="gpl"
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      scriptLoading={{ async: false }}
      init={{
        base_url: "/tinymce",
        suffix: ".min",
        height,
        promotion: false,
        menubar: true,
        plugins: ["link", "table", "lists", "code", "tiny_mce_wiris", "image"],
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",

        verify_html: false,
        extended_valid_elements:
          "math[*],mrow[*],mi[*],mn[*],mo[*],msup[*],msub[*],msubsup[*],mfrac[*],msqrt[*],mroot[*],munder[*],mover[*],munderover[*],ms[*],mtext[*],mtable[*],mtr[*],mtd[*],mstyle[*],semantics[*],annotation[*]",
        custom_elements:
          "math,mi,mn,mo,mrow,msup,msub,msubsup,mfrac,msqrt,mroot,munder,mover,munderover,ms,mtext,mtable,mtr,mtd,mstyle,semantics,annotation",

        relative_urls: false,
        remove_script_host: false,
        convert_urls: false,
      }}
    />
  );
}
