// export default async function fetchQuestions(routeName, page) {
//   const url = `${
//     import.meta.env.VITE_BASE_URL
//   }${routeName}?pagination[page]=${page}&pagination[pageSize]=10`;
//   // const url = `http://127.0.0.1:1337/api/${routeName}?pagination[page]=${page}&pagination[pageSize]=25`;

//   try {
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${jwt_token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data; // Strapi returns { data: [...], meta: { pagination... } }
//   } catch (error) {
//     console.error("Error fetching questions:", error);
//     return null;
//   }
// }

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: StrapiPagination;
  };
}

/**
 * Fetch paginated questions or any Strapi collection.
 * Works for routeName such as `t-questions`, `t-topics`, etc.
 */
export default async function fetchQuestions<T = any>(
  routeName: string,
  page: number
): Promise<StrapiResponse<T[]> | null> {

  let jwt_token =  localStorage.getItem("auth_token");

  const url = `${import.meta.env.VITE_BASE_URL}${routeName}?pagination[page]=${page}&pagination[pageSize]=10&sort=updatedAt:desc`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt_token}`,
      },
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const json = await response.json();
    console.log("json:", json)
    return json as StrapiResponse<T[]>;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return null;
  }
}
