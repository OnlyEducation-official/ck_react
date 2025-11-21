export async function fetchQuestions(routeName,page) {
    // const url = `https://admin.onlyeducation.co.in/api/${routeName}?pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
    const url = `http://127.0.0.1:1337/api/${routeName}?pagination[page]=${page}&pagination[pageSize]=25`;


    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 2f7516c0512eb15783926d08aed7154e4865a0e34608916afedd5d92508270476ebfd70f962abae6898358d88e052be1f464652ca88b3db8df5687a99a2080e3a6050d5da1388d9f53a084964d1fc59a8477f9f15f901ad8a9bd41f49bda3e9fd1f7ac8e4bed9cc2d829f333eb2c4e70b154904ba8a28eb616fd8ef29b8c2bf9'
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
