import {
  Box,
  Container,
} from "@mui/material";
import LoadingComp from "./components/LoadingComp.js";
import GetAllHead from "./components/GetAllHead.js";
import { useSubjects } from "./hooks/getAllSubject.js";
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

interface Props {
  routeName: RoutesEnum;
  lol: string;
  title: {
    singular: string;
    plural: string;
  };
}

const PAGE_SIZE = 10;

// Correct Meili index mapping
function getRouteType(routeName: RoutesEnum): string {
  switch (routeName) {
    case RoutesEnum.CATEGORIES:
      return "t-category";
    case RoutesEnum.QUESTIONS:
      return "t-question";
    case RoutesEnum.SUBJECTS:
      return "test-series-subject";
    case RoutesEnum.TOPICS:
      return "t-topic";
    case RoutesEnum.EXAMS:
      return "t-exam";
    case RoutesEnum.SUBJECTCATEGORIE:
      return "test-series-subject-categorie";
    case RoutesEnum.CHAPTER:
      return "test-series-chapter";
    default:
      return routeName;
  }
}

export default function GetAllList({ routeName, lol, title }: Props) {
  const { isLoading, pagination } = useSubjects();

  // ✅ FULL-SCREEN CENTERED LOADER (UPDATED)
  // -------------------------------------------------------------------
  if (isLoading) <LoadingComp />;
  // -------------------------------------------------------------------

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 6 }}>
        {/* HEADER */}
        <GetAllHead routeName={routeName} to={lol} totalInteger={pagination.total} />

        <GetAllListComp pageRoute={lol} />

      </Box>

    </Container>
  );
}
