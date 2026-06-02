const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ApiOptions = RequestInit;

export async function api<T>(
    endpoint: string,
    options?: ApiOptions
): Promise<T> {
    const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error("Something went wrong");
    }

    return response.json();
}