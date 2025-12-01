import { Routes, Route, Link } from "react-router-dom";
// import Home from './pages/Home'
// import EditPage from './pages/EditPage'
import GetAllList from "./getAll/GetAllPage";
import QuestionPreview from "./ui/Form";
import QuestionPreview2 from "./ui/Form2";
import ResponsiveAppBar from "./ui/Header";
import DrawerAppBar from "./ui/Header1";
import Index from "./addQeustion/Index";
import { InitialDataContextProvider } from "./addQeustion/_components/InitalContext";
import TestTopicPage from "./testTopic/Index";
import TestSubjectPage from "./testSubject/Index";
import TestExamCategoriesForm from "./TestExamCategories/components/TestExamCategoriesForm";
import TestExamsForm from "./test-exams/TestExamsForm";
import TestExamsFormEdit from "./test-exams/TestExamsFormEdit";
import { ToastContainer } from "react-toastify";
import { MeiliDataContextProvide } from "./context/MeiliContext";
import { resources } from "./util/resource";


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
            <GetAllList
              routeName={resources.categories.routeName}
              lol={resources.categories.uid}
              title={resources.categories.labels}
            />
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
          element={
            <GetAllList
              routeName={resources.questions.routeName}
              lol={resources.questions.uid}
              title={resources.questions.labels}
            />
          }
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
            <GetAllList
              routeName={resources.subjects.routeName}
              lol={resources.subjects.uid}
              title={resources.subjects.labels}
            />
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
          element={
            <GetAllList
              routeName={resources.topics.routeName}
              lol={resources.topics.uid}
              title={resources.topics.labels}
            />
          }
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
          element={
            <GetAllList
              routeName={resources.exams.routeName}
              lol={resources.exams.uid}
              title={resources.exams.labels}
            />
          }
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
