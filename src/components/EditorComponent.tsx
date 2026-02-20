import React, { useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Controller, Control } from "react-hook-form";
import type { Editor as TinyMCEEditor } from "tinymce";
import { QuestionSchemaType } from "@/addQeustion/QuestionSchema";

type Props = {
  name: keyof QuestionSchemaType;
  control: Control<QuestionSchemaType>;
  height?: number;
};

function TinyEditorField({
  value,
  onChange,
  height,
}: {
  value: string;
  onChange: (val: string) => void;
  height: number;
}) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const isInitializedRef = useRef(false);
  const lastInternalValue = useRef<string>("");

  const convertMathMLToWirisImages = (editor: TinyMCEEditor) => {
    setTimeout(() => {
      try {
        const doc = editor.getDoc();
        const win = editor.getWin() as any;

        // Find all raw <math> elements that haven't been converted yet
        const mathElements = doc.querySelectorAll("math");

        if (mathElements.length === 0) return;

        // Strategy 1: Use WIRIS JsPluginViewer inside the iframe
        if (win?.com?.wiris?.js?.JsPluginViewer) {
          win.com.wiris.js.JsPluginViewer.parseDocument(doc, true, () => {
            console.log("WIRIS formulas rendered via JsPluginViewer");
          });
          return;
        }

        // Strategy 2: Use WirisPlugin on host window
        const hostWiris = (window as any).WirisPlugin;
        if (hostWiris?.Parser) {
          hostWiris.Parser.initEditor(editor);
          return;
        }

        // Strategy 3: Manually convert each <math> to a WIRIS <img>
        // WIRIS renders MathML by encoding it as a data-mathml attribute on an <img>
        mathElements.forEach((mathEl) => {
          const mathML = mathEl.outerHTML;
          const encoded = encodeURIComponent(mathML);

          const img = doc.createElement("img");
          img.setAttribute(
            "src",
            `/wiris-service/showimage?formula=${encoded}`
          );
          img.setAttribute("data-mathml", mathML);
          img.setAttribute(
            "class",
            "Wirisformula"
          );
          img.setAttribute("role", "math");
          img.setAttribute(
            "alt",
            mathEl.textContent || "Math formula"
          );
          img.style.maxWidth = "none";

          mathEl.parentNode?.replaceChild(img, mathEl);
        });
      } catch (e) {
        console.error("WIRIS render error:", e);
      }
    }, 200);
  };

  const setContentAndRender = (editor: TinyMCEEditor, html: string) => {
    editor.setContent(html);
    lastInternalValue.current = html;
    convertMathMLToWirisImages(editor);
  };

  useEffect(() => {
    if (!editorRef.current || !isInitializedRef.current) return;
    if (!value) return;

    if (value !== lastInternalValue.current) {
      setContentAndRender(editorRef.current, value);
    }
  }, [value]);

  return (
    <Editor
      licenseKey="gpl"
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(_, editor) => {
        editorRef.current = editor;
        isInitializedRef.current = true;

        if (value) {
          // Slight delay to ensure WIRIS plugin is fully loaded inside TinyMCE
          setTimeout(() => {
            setContentAndRender(editor, value);
          }, 300);
        }
      }}
      onEditorChange={(content) => {
        lastInternalValue.current = content;
        onChange(content);
      }}
      init={{
        height,
        promotion: false,
        plugins: ["link", "table", "lists", "code", "image"],
        external_plugins: {
          tiny_mce_wiris: "/tinymce/plugins/tiny_mce_wiris/plugin.min.js",
        },
        toolbar:
          "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | image | tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry",
        // Critical: allow all MathML tags through TinyMCE's HTML sanitizer
        extended_valid_elements:
          "math[*],mrow[*],mi[*],mo[*],mn[*],msup[*],msub[*]," +
          "mfrac[*],msqrt[*],mroot[*],munder[*],mover[*],munderover[*]," +
          "mtable[*],mtr[*],mtd[*],mtext[*],mspace[*],menclose[*]," +
          "semantics[*],annotation[*],annotation-xml[*]",
        valid_children: "+body[style],+body[math]",
        // Prevent TinyMCE from mangling xmlns attributes on <math> tags
        verify_html: false,
        setup: (editor) => {
          editor.on("SetContent", ({ content }) => {
            // Only trigger if the incoming content actually has MathML
            if (content?.includes("<math")) {
              convertMathMLToWirisImages(editor);
            }
          });
        },
      }}
    />
  );
}

export default function EditorComponent({
  name,
  control,
  height = 500,
}: Props) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TinyEditorField
          value={field.value ?? ""}
          onChange={field.onChange}
          height={height}
        />
      )}
    />
  );
}