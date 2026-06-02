// features/subjects/api/subjectApi.ts

import type { PaginatedResponse } from "@/hooks/usePaginatedQuery";
import { apiGet } from "@/lib/apiClient";

import { api } from "@/lib/api";
import {
    ApiError,
    ApiErrorResponse,
    ApiSuccessResponse,
} from "@/types/generic.api.types";

export type Subject = {
    id: number;
    name: string;
    question?: string;
    createdAt: string;
    updatedAt: string;
};

export type SubjectFilters = {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export type GetAllSubjectsParams = SubjectFilters & {
    page: number;
    limit: number;
};

export function getAllTopics(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/topics", params);
}
export function getAllChapters(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/chapters", params);
}
export function getAllSubjectsCategories(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/subject-categories", params);
}
export function getAllSubjects(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/subjects", params);
}
export function getAllExams(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/exams", params);
}
export function getAllExamCategories(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/exam-category", params);
}

export function getAllQuestions(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/questions", params);
}



export async function deleteApi(
    endpoint: string,
    id: number
): Promise<ApiSuccessResponse<null> | ApiErrorResponse> {
    try {
        const res = await api(`${endpoint}/${id}`, {
            method: "DELETE",
        });

        return res as any;
    } catch (error) {
        if (error instanceof ApiError) {
            return error.response;
        }

        throw error;
    }
}