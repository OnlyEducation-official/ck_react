import { Plugin, ButtonView } from "ckeditor5";

export default class InsertImageViaUrl extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add("insertImageViaUrl", (locale) => {
      const button = new ButtonView(locale);

      button.set({
        label: "Insert image via URL",
        icon: "image", // built-in icon
        tooltip: true,
      });

      button.on("execute", () => {
        const url = window.prompt("Enter image URL");

        if (!url || !/^https?:\/\//i.test(url)) {
          alert("Please enter a valid image URL");
          return;
        }

        editor.model.change((writer) => {
          const imageElement = writer.createElement("imageBlock", {
            src: url,
          });

          editor.model.insertContent(
            imageElement,
            editor.model.document.selection,
          );
        });
      });

      return button;
    });
  }
}
