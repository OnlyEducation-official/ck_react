import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import {
    getAllSubjects,
    type Subject,
    type SubjectFilters,
} from "../api/subjectApi";

type UseSubjectsProps = {
    params?: SubjectFilters | undefined;
    initialPage?: number;
    initialLimit?: number;
};

export function useSubjects({
    params,
    initialPage = 1,
    initialLimit = 10,
}: UseSubjectsProps = {}) {
    return usePaginatedQuery<Subject, SubjectFilters>({
        queryKey: ["subjects"],
        queryFn: getAllSubjects,
        params,
        initialPage,
        initialLimit,
    });
}