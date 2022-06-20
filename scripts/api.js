export async function getRecipes() {
    const fetchData = await fetch('data/recipe.json')
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err)
        })
    return fetchData
}