export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type PaginatedApiResponse<T> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: T[];
    meta: {
        pagination: PaginationMeta;
        timestamp: string;
    };
};

export type PaginationQueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export type PaginatedResult<T> = {
    items: T[];
    message: string;
    pagination: PaginationMeta & {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};