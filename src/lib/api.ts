import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

type ApiOptions = RequestInit;

export async function api<T>(
    endpoint: string,
    options?: ApiOptions
): Promise<T> {

    const token = Cookies.get("auth_token");

    // console.log(token)

    // console.log("endpoint:", `${API_BASE_URL}${endpoint}`)
    console.log(options)

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options, 
    
    credentials: "same-origin", 
    
    headers: {
        "Content-Type": "application/json",
        ...options?.headers, 
        ...(token && { 'Authorization': `Bearer ${token}` }), 
    },
});


    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        const backendMessage = errorData?.message || "Something went wrong";

        throw new Error(backendMessage);
    }

    // Normal 2xx success path
    return response.json();
}