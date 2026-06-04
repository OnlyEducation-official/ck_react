import { api } from "@/lib/api";
import { ApiError, ApiErrorResponse, ApiSuccessResponse } from "@/types/generic.api.types";

export async function CreateSyllabus(
    endpoint: string,
    id: number
): Promise<ApiSuccessResponse<null> | ApiErrorResponse> {
    try {
        const res = await api(`${endpoint}/${id}`, {
            method: "POST",
        });

        return res as any;
    } catch (error) {
        if (error instanceof ApiError) {
            return error.response;
        }

        throw error;
    }
}
export async function EditSyllabus(
    endpoint: string,
    id: number
): Promise<ApiSuccessResponse<null> | ApiErrorResponse> {
    try {
        const res = await api(`${endpoint}/${id}`, {
            method: "PUT",
        });

        return res as any;
    } catch (error) {
        if (error instanceof ApiError) {
            return error.response;
        }

        throw error;
    }
}