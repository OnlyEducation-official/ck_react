import { apiGet } from "../lib/apiClient";
import type { PaginatedResponse } from "../types/api.types";

export type Subject = {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    questionId: number | null;
};

export type SubjectQueryParams = {
    page: number;
    limit: number;
    search?: string;
};

export function getSubjects(
    params: SubjectQueryParams
): Promise<PaginatedResponse<Subject>> {
    return apiGet<PaginatedResponse<Subject>>("/subjects", params);
}