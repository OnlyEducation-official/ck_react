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

function App() {
  return (
    <div>
      <DrawerAppBar />

      <Routes>
        <Route
          path="/"
          element={
            <InitialDataContextProvider>
              <Index />
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-exams"
          element={
            <InitialDataContextProvider>
              <TestExamsForm />
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-exams/:id"
          element={
            <InitialDataContextProvider>
              <TestExamsFormEdit />
            </InitialDataContextProvider>
          }
        />

        {/* t-questions */}
        <Route path="/questions-list" element={<GetAllList routeName="t-questions" lol="questions" />} />
        <Route path="/questions" element={<QuestionPreview />} />
        <Route path="/questions/edit/:qid" element={<QuestionPreview />} />

        {/* t-categories */}
        <Route path="/test-exams-category-list" element={<GetAllList routeName="t-categories" lol="test-exams-category" />} />
        <Route path="/test-exams-category" element={<TestExamCategoriesForm />} />
        <Route path="/test-exams-category/edit/:qid" element={<TestExamCategoriesForm />} />

        {/* t-subjects */}
        <Route path="/test-subject-list" element={<GetAllList routeName="test-series-subjects" lol="test-subject" />} />
        <Route path="/test-subject" element={<TestSubjectPage />} />
        <Route path="/test-subject/edit/:qid" element={<TestSubjectPage />} />

        {/* t-topic */}
        <Route path="/test-topic-list" element={<GetAllList routeName="t-topics" lol="test-topic" />} />
        <Route
          path="/test-topic"
          element={
            <InitialDataContextProvider>
              <TestTopicPage />
            </InitialDataContextProvider>
          }
        />
        <Route
          path="/test-topic/edit/:qid"
          element={
            <InitialDataContextProvider>
              <TestTopicPage />
            </InitialDataContextProvider>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <InitialDataContextProvider>
              <QuestionPreview2 />
            </InitialDataContextProvider>
          }
        />

      </Routes>
    </div>
  );
}

export default App;
