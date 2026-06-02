export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ApiMeta = {
    pagination: PaginationMeta;
    timestamp: string;
};

export type ApiResponse<TData> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: TData;
    meta: ApiMeta;
};

export type PaginatedResponse<TItem> = ApiResponse<TItem[]>;