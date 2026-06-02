import { ApiMeta } from "./api.types";

export type ApiSuccessResponse<TData> = {
    success: true;
    statusCode: number;
    message: string;
    data: TData;
    meta: ApiMeta;
};

export type ApiErrorResponse = {
    success: false;
    statusCode: number;
    message: string;
    meta?: ApiMeta;
    stack?: string;
};

export type GenericApiResponse<TData> = ApiSuccessResponse<TData> | ApiErrorResponse;


export class ApiError extends Error {
    statusCode: number;
    response: ApiErrorResponse;

    constructor(response: ApiErrorResponse) {
        super(response.message);
        this.name = "ApiError";
        this.statusCode = response.statusCode;
        this.response = response;
    }
}