import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller } from "react-hook-form";
import type { Control, FieldPathByValue } from "react-hook-form";
import type { Editor as TinyMCEEditor } from "tinymce";
import { QuestionSchemaType } from "@/addQeustion/QuestionSchema";

type Props = {
  name: FieldPathByValue<QuestionSchemaType, string>;
  control: Control<QuestionSchemaType>;
  height?: number;
};

export default function EditorComponent({ name, control, height = 500 }: Props) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const settingRef = useRef(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = (field.value ?? "") as string;

        useEffect(() => {
          const ed = editorRef.current;
          if (!ed) return;

          const current = ed.getContent();
          if (current === value) return;

          settingRef.current = true;
          ed.setContent(value);
          setTimeout(() => (settingRef.current = false), 0);
        }, [value]);

        return (
          <Editor
            licenseKey="gpl"
            scriptLoading={{ async: false }}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            onInit={(_, ed) => {
              editorRef.current = ed;
              settingRef.current = true;
              ed.setContent(value);
              setTimeout(() => (settingRef.current = false), 0);
            }}
            onEditorChange={(html) => {
              if (settingRef.current) return;
              field.onChange(html);
            }}
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
      }}
    />
  );
}
