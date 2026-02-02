class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(file => {
      const formData = new FormData();
      formData.append("file", file);

      return fetch(import.meta.env.VITE_UPLOAD_URL, {
        method: "POST",
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          return {
            default: data.url,      // image src
            imageId: data.imageId,  // stable ID
            s3Key: data.key,        // S3 object key
          };
        });
    });
  }

  abort() {}
}

export function UploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = loader =>
    new UploadAdapter(loader);
}
