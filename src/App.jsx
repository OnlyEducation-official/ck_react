// // import React, { useState, useCallback } from "react";
// // import MainEditor from "./components/MainEditor";
// import QuestionPreview from "./ui/Form";
// import QuestionPreview2 from "./ui/Form2";

// function App() {

//   // Example initial HTML for editor
//   // const [initialHTML] = useState("<p>Start typing or insert equations here...</p>");

//   // Capture content changes from MainEditor (debounced 500ms)
//   // const handleEditorChange = useCallback((html, { docId }) => {
//   //   console.log("✅ Document updated:", docId);
//   //   console.log("📝 Current HTML:", html);
//   // }, []);

//   return (
//     <>
//       {/* <h2 style={{ paddingBlockEnd: "10px" }}>CKEditor – Semi-Controlled Mode</h2> */}

//       {/* Pass the required props */}
//       {/* <MainEditor
//         docId={"doc-001"}
//         initialHTML={initialHTML}
//         onChange={handleEditorChange}
//       />
//       <MainEditor
//         docId={"doc-002"}
//         initialHTML={initialHTML}
//         onChange={handleEditorChange}
//       /> */}

//       <QuestionPreview />
//       {/* <QuestionPreview2 /> */}

//     </>
//   );
// }

// export default App;

import { Routes, Route, Link } from 'react-router-dom'
// import Home from './pages/Home'
// import EditPage from './pages/EditPage'
import GetAllList from './getAll/GetAllPage'
import QuestionPreview from "./ui/Form";
import QuestionPreview2 from "./ui/Form2";
import ResponsiveAppBar from './ui/Header';
import DrawerAppBar from './ui/Header1';
import Index from './addQeustion/Index';


function App() {
  return (
    <div>
      {/* <ResponsiveAppBar /> */}
      <DrawerAppBar />
      {/* <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/Listing">Edit Example</Link>
      </nav> */}

      <Routes>
        <Route path="/:id" element={<Index />} />
        <Route path="/q" element={<QuestionPreview />} />
        <Route path="/edit/:id" element={<QuestionPreview2 />} />
        <Route path="/listing" element={<GetAllList />} />
      </Routes>
    </div>
  )
}

export default App