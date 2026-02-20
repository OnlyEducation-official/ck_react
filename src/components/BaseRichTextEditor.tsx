// components/form/BaseRichTextEditor.tsx
import React, { useMemo } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  height?: number;
  label?: string;
};

function BaseRichTextEditor<T extends FieldValues>({
  name,
  control,
  height = 300,
}: Props<T>) {
  const editorConfig = useMemo(
    () => ({
      base_url: "/tinymce",
      suffix: ".min",
      height,
      menubar: true,
      promotion: false,
      plugins: ["link", "table", "lists", "code", "image", "tiny_mce_wiris"],
      toolbar:
        "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | image | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",
      verify_html: false,
      extended_valid_elements:
        "math[*],mrow[*],mi[*],mn[*],mo[*],msup[*],msub[*],msubsup[*],mfrac[*],msqrt[*],mroot[*],munder[*],mover[*],munderover[*],ms[*],mtext[*],mtable[*],mtr[*],mtd[*],mstyle[*],semantics[*],annotation[*]",
      custom_elements:
        "math,mi,mn,mo,mrow,msup,msub,msubsup,mfrac,msqrt,mroot,munder,mover,munderover,ms,mtext,mtable,mtr,mtd,mstyle,semantics,annotation",
      relative_urls: false,
      remove_script_host: false,
      convert_urls: false,
    }),
    [height],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Editor
          value={field.value || ""}
          onEditorChange={(content) => field.onChange(content)}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          licenseKey="gpl"
          init={editorConfig}
        />
      )}
    />
  );
}

export default React.memo(BaseRichTextEditor) as typeof BaseRichTextEditor;
