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
};

export default function EditorComponent<T extends FieldValues>({
  name,
  setValue,
  watch,
  value,
  height = 500,
}: Props<T>) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const previousExternalValue = useRef<string>("");

  const externalValue = typeof watch === "function" ? watch(name) : value;

  // Only sync when external value truly changes (like reset)
  useEffect(() => {
    if (!editorRef.current) return;

    if (
      externalValue !== undefined &&
      externalValue !== previousExternalValue.current &&
      editorRef.current.getContent() !== externalValue
    ) {
      editorRef.current.setContent(externalValue || "");
      previousExternalValue.current = externalValue || "";
    }
  }, [externalValue]);

  return (
    <Editor
      onInit={(_, editor) => {
        editorRef.current = editor;
        previousExternalValue.current = externalValue || "";
        editor.setContent(externalValue || "");
      }}
      onEditorChange={(html) => {
        // Direct update — no debounce
        setValue(name, html as any, {
          shouldDirty: true,
          shouldValidate: false,
        });
      }}
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
