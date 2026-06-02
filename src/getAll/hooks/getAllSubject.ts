import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import {
    getAllChapters,
    getAllExamCategories,
    getAllExams,
    getAllQuestions,
    // getAllExams,
    getAllSubjects,
    getAllSubjectsCategories,
    getAllTopics,
    type Subject,
    type SubjectFilters,
} from "../api/subjectApi";
import { Syllabus } from "../GetAllPage";

type UseSubjectsProps = {
    params?: SubjectFilters | undefined;
    initialPage?: number;
    initialLimit?: number;
    syllabus: Syllabus
};

function syllabusAsPerPageRoute(syllabus: Syllabus) {
    if (syllabus === "topic") {
        return ({
            queryFn: getAllTopics,
            queryKey: ["topics"],
        });
    }
    else if (syllabus === "chapter") {
        return ({
            queryFn: getAllChapters,
            queryKey: ["chapters"],
        });
    }
    else if (syllabus === "subject-category") {
        return ({
            queryFn: getAllSubjectsCategories,
            queryKey: ["subject-category"],
        }); 0
        0
    }
    else if (syllabus === "subject") {
        return ({
            queryFn: getAllSubjects,
            queryKey: ["subjects"],
        });
    }
    else if (syllabus === "exam-category") {
        return ({
            queryFn: getAllExamCategories,
            queryKey: ["exam-category"],
        });
    }
    else if (syllabus === "question") {
        return ({
            queryFn: getAllQuestions,
            queryKey: ["questions"],
        });
    }
    else if (syllabus === "exam") {
        return ({
            queryFn: getAllExams,
            queryKey: ["exams"],
        });
    }
    else {
        return ({
            queryFn: () => null as any,
            queryKey: ["asd"],
        });
    }
}

export function useSyllabusData({
    params,
    initialPage = 1,
    initialLimit = 10,
    syllabus
}: UseSubjectsProps) {
    return usePaginatedQuery<Subject, SubjectFilters>({
        queryKey: syllabusAsPerPageRoute(syllabus).queryKey,
        queryFn: syllabusAsPerPageRoute(syllabus).queryFn,
        params,
        initialPage,
        initialLimit,
    });
}