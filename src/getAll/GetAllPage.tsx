import {
  Box,
  Container,
} from "@mui/material";
import LoadingComp from "./components/LoadingComp.js";
import GetAllHead from "./components/GetAllHead.js";
import { useSyllabusData } from "./hooks/getAllSubject.js";
import GetAllListComp from "./GetAllListComp.js";

export enum RoutesEnum {
  CATEGORIES = "t-categories",
  QUESTIONS = "t-questions",
  SUBJECTS = "test-series-subjects",
  TOPICS = "t-topics",
  EXAMS = "t-exams",
  SUBJECTCATEGORIE = "test-series-subject-categories",
  CHAPTER = "test-series-chapters",
}
export type Syllabus = "subject" | "chapter" | "topic" | "exam" | "question" | "exam-category" | "subject-category";

interface Props {
  routeName: RoutesEnum;
  lol: string;
  syllabus: Syllabus;
  title: {
    singular: string;
    plural: string;
  };
}

export default function GetAllList({ routeName, lol, syllabus }: Props) {
  const { isLoading, pagination } = useSyllabusData({
    syllabus
  });

  // ✅ FULL-SCREEN CENTERED LOADER (UPDATED)
  // -------------------------------------------------------------------
  if (isLoading) <LoadingComp />;
  // -------------------------------------------------------------------

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        {/* HEADER */}
        <GetAllHead routeName={routeName} to={lol} totalInteger={pagination.total} />

        <GetAllListComp pageRoute={lol} syllabus={syllabus} />

      </Box>

    </Container>
  );
}
