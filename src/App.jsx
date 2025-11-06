// import React, { useState, useCallback } from "react";
// import MainEditor from "./components/MainEditor";
// import QuestionPreview from "./ui/Form";
import QuestionPreview2 from "./ui/Form2";

function App() {

  // Example initial HTML for editor
  // const [initialHTML] = useState("<p>Start typing or insert equations here...</p>");

  // Capture content changes from MainEditor (debounced 500ms)
  // const handleEditorChange = useCallback((html, { docId }) => {
  //   console.log("✅ Document updated:", docId);
  //   console.log("📝 Current HTML:", html);
  // }, []);

  return (
    <>
      {/* <h2 style={{ paddingBlockEnd: "10px" }}>CKEditor – Semi-Controlled Mode</h2> */}

      {/* Pass the required props */}
      {/* <MainEditor
        docId={"doc-001"}
        initialHTML={initialHTML}
        onChange={handleEditorChange}
      />
      <MainEditor
        docId={"doc-002"}
        initialHTML={initialHTML}
        onChange={handleEditorChange}
      /> */}

      {/* <QuestionPreview /> */}
      <QuestionPreview2 />

    </>
  );
}

export default App;
