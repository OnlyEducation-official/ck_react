export async function fetchQuestions(routeName,page) {
    // const url = `https://admin.onlyeducation.co.in/api/${routeName}?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const url = `http://127.0.0.1:1337/api/${routeName}?pagination[page]=${page}&pagination[pageSize]=25`;


    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${import.meta.env.VITE_STRAPI_BEARER}`
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data; // Strapi returns { data: [...], meta: { pagination... } }
    } catch (error) {
        console.error("Error fetching questions:", error);
        return null;
    }
}
