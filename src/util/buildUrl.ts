// utils/buildUrl.ts

type QueryParams = Record<string, string | number | boolean | undefined | null>;

export function buildUrl(
    apiBaseUrl: string,
    endpoint: string,
    params?: QueryParams
): string {
    const baseUrl = apiBaseUrl.replace(/\/+$/, "");
    const normalizedEndpoint = endpoint.startsWith("/")
        ? endpoint
        : `/${endpoint}`;

    const url = new URL(`${baseUrl}${normalizedEndpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url.toString();
}