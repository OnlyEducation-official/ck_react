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
import Login from "./Login/Login";
import ProtectedRoute from "./GlobalComponent/ProtectedRoute";
import SubjectChapterForm from "./SubjectChapterForm/SubjectChapterForm";
import SubjectCategories from "./SubjectCategories/SubjectCategories";
import PublicRoute from "./GlobalComponent/PublicRoute.js";
import NotFound from "./pages/NotFound.js";
import HomePageRedirect from "./pages/HomePageRedirect.js";
// import SubjectCategories from './SubjectCategories/'

function App() {
  return (
    <div>
      <DrawerAppBar />
      <ToastContainer position="top-center" autoClose={2000} />

      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomePageRedirect />} />

        {/* t-categories */}
        <Route
          path="/test-exams-category-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/test-exams-category-list"
                routeName="t-categories"
                lol="test-exams-category"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-exams-category"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                <TestExamCategoriesForm />
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-chapter-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/test-chapter-list"
                routeName="test-series-chapters"
                lol="test-chapter"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-chapter"
          element={
            <ProtectedRoute>
              <SubjectChapterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-chapter/edit/:qid"
          element={
            <ProtectedRoute>
              <SubjectChapterForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-subject-category-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/test-subject-category-list"
                routeName="test-series-subject-categories"
                lol="test-subject-category"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-subject-category"
          element={
            <ProtectedRoute>
              <SubjectCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-subject-category/edit/:qid"
          element={
            <ProtectedRoute>
              <SubjectCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-exams-category/edit/:id"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                <TestExamCategoriesForm />
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        {/* t-categories */}

        {/* t-questions */}
        <Route
          path="/questions-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/questions-list"
                routeName="t-questions"
                lol="questions"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <MeiliDataContextProvide>
                <QuestionPreview2 />
              </MeiliDataContextProvide>
            </ProtectedRoute>
          }
        />

        <Route
          path="/questions/edit/:qid"
          element={
            <ProtectedRoute>
              <MeiliDataContextProvide>
                <QuestionPreview2 />
              </MeiliDataContextProvide>
            </ProtectedRoute>
          }
        />
        {/* t-questions */}

        {/* t-subjects */}
        <Route
          path="/test-subject-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/test-subject-list"
                routeName="test-series-subjects"
                lol="test-subject"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-subject"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                <TestSubjectPage />
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-subject/edit/:qid"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                <TestSubjectPage />
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        {/* t-subjects */}

        {/* t-topic */}
        <Route
          path="/test-topic-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/test-topic-list"
                routeName="t-topics"
                lol="test-topic"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-topic"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                {" "}
                <TestTopicPage />{" "}
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-topic/edit/:qid"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                {" "}
                <TestTopicPage />{" "}
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        {/* t-topic */}

        {/* t-exams */}
        <Route
          path="/exams-list"
          element={
            <ProtectedRoute>
              <GetAllList
                key="/exams-list"
                routeName="t-exams"
                lol="test-exams"
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-exams"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                {" "}
                <TestExamsForm />{" "}
              </InitialDataContextProvider>
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-exams/edit/:id"
          element={
            <ProtectedRoute>
              <InitialDataContextProvider>
                {" "}
                <TestExamsFormEdit />{" "}
              </InitialDataContextProvider>
            </ProtectedRoute>
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
