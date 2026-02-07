import React, { useEffect, useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Image,
  ImageToolbar,
  ImageCaption,
  // ImageUpload,
  Heading,
  ImageStyle,
  ImageResize,
  Base64UploadAdapter,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageInsert,
  AutoImage,
  Table,
  TableToolbar,
  TableProperties,
  TableCellProperties,
  TableColumnResize,
  FontSize,
  List,
  ListProperties,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import MathType from "@wiris/mathtype-ckeditor5/dist/index.js";
// import InsertImageViaUrl from "./insertImageViaUrl";

// import { Image } from "@ckeditor/ckeditor5-image/src/image";
// import { ImageToolbar } from "@ckeditor/ckeditor5-image/src/imagetoolbar";
// import { ImageUpload } from "@ckeditor/ckeditor5-image/src/imageupload";
// import { ImageCaption } from "@ckeditor/ckeditor5-image/src/imagecaption";
// import { ImageStyle } from "@ckeditor/ckeditor5-image/src/imagestyle";

import { UploadAdapterPlugin } from "./ckeditorUploadAdapter";
import { ImageIdPlugin } from "./imageIdPlugin";

const MainEditor = ({ name, setValue, watch, value, debounceMs = 400 }) => {
  const [editorError, setEditorError] = React.useState(null);
  console.log("editorError: ", editorError);
  // use watch if provided, else fallback to value prop
  const currentValue = typeof watch === "function" ? watch(name) : value;
  const latestValue = useRef(currentValue ?? "");
  const debounceTimer = useRef(null);

  console.log("currentValue: ", currentValue);
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
          plugins: [
            Essentials,
            Paragraph,
            Heading, // ✅ REQUIRED
            FontSize,
            Bold,
            MathType,
            Image,
            ImageToolbar,
            // ImageUpload,
            ImageCaption,
            ImageStyle,
            MathType,
            Base64UploadAdapter,
            ImageResize,
            ImageResizeEditing,
            ImageResizeHandles,
            ImageInsert, // ✅ REQUIRED
            AutoImage, // ✅ REQUIRED
            // Tables ✅
            List,
            ListProperties,
            Table,
            TableToolbar,
            TableProperties,
            TableCellProperties,
            TableColumnResize,
            // InsertImageViaUrl, // ✅ ADD THIS
          ],
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
          },
          toolbar: [
            "undo",
            "redo",
            "heading", // ✅ H1–H6 dropdown
            "fontSize", // ✅
            "bulletedList", // ✅ unordered list
            "numberedList", // ✅ ordered list
            "|",
            "bold",
            "MathType",
            "insertImage",
            "insertTable",
          ],
          // UploadAdapterPlugin,
          extraPlugins: [ImageIdPlugin],
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
            ],
          },
          fontSize: {
            options: [12, 14, 16, 18, 20, 24, 30, 36],
            supportAllValues: false,
          },
          table: {
            contentToolbar: [
              "tableColumn",
              "tableRow",
              "mergeTableCells",
              "|",
              "tableProperties",
              "tableCellProperties",
            ],
            tableProperties: {
              borderColors: [
                { color: "hsl(0, 0%, 0%)", label: "Black" },
                { color: "hsl(0, 0%, 60%)", label: "Grey" },
              ],
              backgroundColors: [
                { color: "hsl(0, 0%, 90%)", label: "Light grey" },
              ],
            },
            tableCellProperties: {
              borderColors: [{ color: "hsl(0, 0%, 0%)", label: "Black" }],
              backgroundColors: [
                { color: "hsl(0, 0%, 90%)", label: "Light grey" },
              ],
            },
          },
          image: {
            insert: {
              integrations: ["url"], // upload + URL
            },
            resizeUnit: "%",
            resizeOptions: [
              { name: "resizeImage:original", label: "Original", value: null },
              { name: "resizeImage:25", label: "25%", value: "25" },
              { name: "resizeImage:50", label: "50%", value: "50" },
              { name: "resizeImage:75", label: "75%", value: "75" },
            ],
            toolbar: [
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
              "|",
              "toggleImageCaption",
              "|",
              // "insertImage", // ✅ dropdown with Upload + URL
              // "linkImage", // ✅ THIS controls image link
            ],
          },
        }}
        data={currentValue ?? ""}
        onChange={(_, editor) => {
          const data = editor.getData();
          handleEditorChange(data);
        }}
        onError={(error, { willEditorRestart }) => {
          console.error("CKEditor onError:", error);

          if (willEditorRestart) {
            console.warn("Editor will restart due to error");
          }

          if (error?.message?.includes("license-key")) {
            // Show custom UI
            setEditorError("CKEditor license expired");
          }
        }}
      />
    </div>
  );
};

export default React.memo(MainEditor);
