// utils/pagination.ts

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

type CreatePaginationControlsProps = {
    pagination?: PaginationMeta | undefined;
    fallbackPage: number;
    fallbackLimit: number;
    setPage: (page: number) => void;
    setLimitState: (limit: number) => void;
};

export function createPaginationControls({
    pagination,
    fallbackPage,
    fallbackLimit,
    setPage,
    setLimitState,
}: CreatePaginationControlsProps) {
    const currentPagination: PaginationMeta = pagination ?? {
        page: fallbackPage,
        limit: fallbackLimit,
        total: 0,
        totalPages: 1,
    };

    const hasNextPage = currentPagination.page < currentPagination.totalPages;
    const hasPreviousPage = currentPagination.page > 1;

    const goToPage = (targetPage: number) => {
        const safePage = Math.min(
            Math.max(targetPage, 1),
            currentPagination.totalPages || 1
        );

        setPage(safePage);
    };

    const nextPage = () => {
        if (!hasNextPage) return;
        goToPage(currentPagination.page + 1);
    };

    const previousPage = () => {
        if (!hasPreviousPage) return;
        goToPage(currentPagination.page - 1);
    };

    const setLimit = (newLimit: number) => {
        setLimitState(newLimit);
        setPage(1);
    };

    const resetPage = () => {
        setPage(1);
    };

    return {
        pagination: currentPagination,

        hasNextPage,
        hasPreviousPage,

        nextPage,
        previousPage,
        setPage: goToPage,
        setLimit,
        resetPage,
    };
}