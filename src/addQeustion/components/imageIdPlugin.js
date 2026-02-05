export function ImageIdPlugin(editor) {
  // Model → HTML
  editor.conversion.for("downcast").attributeToAttribute({
    model: "imageId",
    view: "data-image-id",
  });

  // HTML → Model
  editor.conversion.for("upcast").attributeToAttribute({
    view: {
      name: "img",
      key: "data-image-id",
    },
    model: "imageId",
  });

  // Auto-assign ID to new images
  editor.model.document.on("change:data", () => {
    const model = editor.model;
    const root = model.document.getRoot();

    model.change(writer => {
      for (const item of model.createRangeIn(root)) {
        const el = item.item;

        if (
          el.is("element", "imageBlock") ||
          el.is("element", "imageInline")
        ) {
          if (!el.getAttribute("imageId")) {
            writer.setAttribute(
              "imageId",
              crypto.randomUUID(),
              el
            );
          }
        }
      }
    });
  });
}
