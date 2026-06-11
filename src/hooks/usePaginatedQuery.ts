import { createPaginationControls, PaginationMeta } from "@/util/pagination";
import {
    keepPreviousData,
    useQuery,
    type QueryKey,
} from "@tanstack/react-query";
import { useState } from "react";

type ApiResponse<TData> = {
    success: boolean;
    statusCode: number;
    message: string;
    data: TData;
    meta: {
        pagination: PaginationMeta;
        timestamp: string;
    };
};

export type PaginatedResponse<TItem> = ApiResponse<TItem[]>;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

type UsePaginatedQueryProps<TItem, TParams extends QueryParams> = {
    queryKey: QueryKey;
    queryFn: (
        params: TParams & {
            page: number;
            limit: number;
        }
    ) => Promise<PaginatedResponse<TItem>>;
    params?: TParams | undefined;
    initialPage?: number;
    initialLimit?: number;
};

export function usePaginatedQuery<
    TItem,
    TParams extends QueryParams = Record<string, never>
>({
    queryKey,
    queryFn,
    params,
    initialPage = 1,
    initialLimit = 10,
}: UsePaginatedQueryProps<TItem, TParams>) {
    const [page, setPageState] = useState(initialPage);
    const [limit, setLimitState] = useState(initialLimit);

    const query = useQuery({
        queryKey: [...queryKey, page, limit, params],
        queryFn: () =>
            queryFn({
                ...(params ?? ({} as TParams)),
                page,
                limit,
            }),
        placeholderData: keepPreviousData,
    });

    const paginationControls = createPaginationControls({
        pagination: query.data?.meta.pagination,
        fallbackPage: page,
        fallbackLimit: limit,
        setPage: setPageState,
        setLimitState,
    });

    return {
        ...query,

        items: query.data?.data ?? [],

        page,
        limit,

        ...paginationControls,
    };
}