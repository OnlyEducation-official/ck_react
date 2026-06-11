// lib/api/apiGet.ts

import { buildUrl } from "@/util/buildUrl";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

type QueryParams = Record<string, string | number | boolean | undefined | null>;

export async function apiGet<TResponse>(
    endpoint: string,
    params?: QueryParams
): Promise<TResponse> {
    
    const url = buildUrl(API_BASE_URL, endpoint, params);
    const token = Cookies.get("auth_token");

    console.log(token)

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const result = await response.json();

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const backendMessage = errorData?.message || "Something went wrong";

        throw new Error(backendMessage);
    }

    return result as TResponse;
};