// lib/api/apiGet.ts

import { buildUrl } from "@/util/buildUrl";

const API_BASE_URL = "http://localhost:5000/api";

type QueryParams = Record<string, string | number | boolean | undefined | null>;

export async function apiGet<TResponse>(
    endpoint: string,
    params?: QueryParams
): Promise<TResponse> {
    const url = buildUrl(API_BASE_URL, endpoint, params);

    const response = await fetch(url);

    const result = await response.json();

    if (!response.ok || result.success === false) {
        throw new Error(result.message || "Something went wrong");
    }

    return result as TResponse;
};