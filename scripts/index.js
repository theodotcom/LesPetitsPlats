async function getRecipes() {
    const fetchData = await fetch('data/recipe.json')
    .then((response) => {
      return response.json()
    })
    .then((data) =>{
      return data;})
    .catch((err) => {
      console.log(err)
    })
    return fetchData
}

async function displayData(recipes) {
    const recipeSection = document.querySelector(".recipe_section");
    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const userCardDOM = recipeModel.getUserCardDOM();
        recipeSection.appendChild(userCardDOM);
    });
};

async function init() {
    // Récupère les datas des recettes
    const { recipes  } = await getRecipes();
    
    console.log('all recipes',recipes)
    
    displayData(recipes);
};
init();

function recipeFactory(data) {
    const {name, servings, ingredients, ingredient, quantity, unit, time, description, appliance, ustensils} = data;
    
    function getUserCardDOM() {
      const article = document.createElement("article");
      const picture = `assets/logolpp.png`; 
      const img = document.createElement("img");
      img.setAttribute("src", picture);
      const h2 = document.createElement("h2");
      h2.textContent = name;
      const h3 = document.createElement("h3");
      h3.textContent = "for"+ " " + servings + " " + "people";
      const my1p = document.createElement("p");
      my1p.textContent = JSON.stringify(ingredients);
      const my2p = document.createElement("p");
      my2p.textContent = time +" "+ "min";
      const my3p = document.createElement("p");
      my3p.textContent = description;
      article.appendChild(img);
      article.appendChild(h2);
      article.appendChild(h3);
      article.appendChild(my1p);
      article.appendChild(my2p);
      article.appendChild(my3p);

      return article;
    }
    return { getUserCardDOM };
  }