import { Routes, Route, Link } from "react-router-dom";
import QuestionPreview2 from "./ui/Form2.jsx";
import DrawerAppBar from "./ui/Header1.jsx";
import Index from "./addQeustion/Index.js";
import { InitialDataContextProvider } from "./addQeustion/_components/InitalContext.js";
import TestTopicPage from "./testTopic/Index.js";
import TestSubjectPage from "./testSubject/Index.js";
import TestExamCategoriesForm from "./TestExamCategories/components/TestExamCategoriesForm.js";
import TestExamsForm from "./test-exams/TestExamsForm.js";
import TestExamsFormEdit from "./test-exams/TestExamsFormEdit.js";
import { ToastContainer } from "react-toastify";
import { MeiliDataContextProvide } from "./context/MeiliContext.js";
import GetAllList from "./getAll/GetAllPage.js";

function App() {
  return (
    <div>
      <DrawerAppBar />
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route
          path="/"
          element={
            <InitialDataContextProvider>
              <MeiliDataContextProvide>
                <Index />
              </MeiliDataContextProvide>
            </InitialDataContextProvider>
          }
        />

        {/* t-categories */}
        <Route
          path="/test-exams-category-list"
          element={
            <GetAllList routeName="t-categories" lol="test-exams-category" />
          }
        />
        <Route
          path="/test-exams-category"
          element={
            <InitialDataContextProvider>
              <TestExamCategoriesForm />
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-exams-category/edit/:id"
          element={
            <InitialDataContextProvider>
              <TestExamCategoriesForm />
            </InitialDataContextProvider>
          }
        />
        {/* t-categories */}

        {/* t-questions */}
        <Route
          path="/questions-list"
          element={<GetAllList routeName="t-questions" lol="questions" />}
        />
        <Route
          path="/questions"
          element={
            <MeiliDataContextProvide>
              <QuestionPreview2 />
            </MeiliDataContextProvide>
          }
        />

        <Route
          path="/questions/edit/:qid"
          element={
            <MeiliDataContextProvide>
              <QuestionPreview2 />
            </MeiliDataContextProvide>
          }
        />
        {/* t-questions */}

        {/* t-subjects */}
        <Route
          path="/test-subject-list"
          element={
            <GetAllList routeName="test-series-subjects" lol="test-subject" />
          }
        />
        <Route
          path="/test-subject"
          element={
            <InitialDataContextProvider>
              <TestSubjectPage />
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-subject/edit/:qid"
          element={
            <InitialDataContextProvider>
              <TestSubjectPage />
            </InitialDataContextProvider>
          }
        />
        {/* t-subjects */}

        {/* t-topic */}
        <Route
          path="/test-topic-list"
          element={<GetAllList routeName="t-topics" lol="test-topic" />}
        />
        <Route
          path="/test-topic"
          element={
            <InitialDataContextProvider>
              {" "}
              <TestTopicPage />{" "}
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-topic/edit/:qid"
          element={
            <InitialDataContextProvider>
              {" "}
              <TestTopicPage />{" "}
            </InitialDataContextProvider>
          }
        />
        {/* t-topic */}

        {/* t-exams */}
        <Route
          path="/exams-list"
          element={<GetAllList routeName="t-exams" lol="test-exams" />}
        />
        <Route
          path="/test-exams"
          element={
            <InitialDataContextProvider>
              {" "}
              <TestExamsForm />{" "}
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-exams/edit/:id"
          element={
            <InitialDataContextProvider>
              {" "}
              <TestExamsFormEdit />{" "}
            </InitialDataContextProvider>
          }
        />
        {/* t-exams */}

        {/* <Route
          path="/edit/:id"
          element={
            <InitialDataContextProvider>
              <QuestionPreview2 />
            </InitialDataContextProvider>
          }
        /> */}
      </Routes>
    </div>
  );
}

export default App;
