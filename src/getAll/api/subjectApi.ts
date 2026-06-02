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

export function getAllSubjects(params: GetAllSubjectsParams) {
    return apiGet<PaginatedResponse<Subject>>("/subjects", params);
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