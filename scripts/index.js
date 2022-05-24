let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = ''

async function getRecipes() {
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
 

async function displayData(recipes) {
    const recipeSection = document.querySelector(".recipe_section");
    recipeSection.innerHTML = ''
    recipes.forEach((recipe) => {
        const recipeModel = recipeFactory(recipe);
        const userCardDOM = recipeModel.getUserCardDOM();
        recipeSection.appendChild(userCardDOM);
    });
};

function initEventForm(){
    const researchBar = document.querySelector('.research_bar input')
    researchBar.addEventListener('input', (e) => {
        e.preventDefault()
        if(e.target.value.length === 0){
            displayData(allRecipes)
            return
        }
        if(e.target.value.length < 3){
            return
        }
        query = e.target.value
        description = e.target.value
        ingredients = [e.target.value]
        filterRecipes()
        
    })
}

async function init() {
    // Récupère les datas des recettes
    const {recipes} = await getRecipes();
    allRecipes = recipes
    console.log('all recipes', recipes)
    displayData(recipes);
    initEventForm()
    filterRecipes()
    console.log('ntm', recipes)
    ingredientsTags()
};


function recipeFactory(data) {
    const {name, servings, time, description, appliance, ustensils} = data;
    function getUserCardDOM() {
        const article = document.createElement("article");
        const picture = `assets/logolpp.png`;
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        const h2 = document.createElement("h2");
        h2.textContent = name;
        const h3 = document.createElement("h3");
        h3.textContent = "for" + " " + servings + " " + "people";
        var myIng = document.createElement("ul");
        var ingredients = data['ingredients'];
        for (var i = 0; i < ingredients.length; i++) {
            var myPara3 = document.createElement('li');
            if (ingredients[i].ingredient === undefined)
                ingredients[i].ingredient = '';
            if (ingredients[i].quantity === undefined)
                ingredients[i].quantity = '';
            if (ingredients[i].unit === undefined)
                ingredients[i].unit = '';
            myPara3.textContent = ingredients[i].ingredient + " " + ingredients[i].quantity + " " + ingredients[i].unit;
            myIng.appendChild(myPara3)
        }
        const my2p = document.createElement("p");
        my2p.textContent = time + " " + "min";
        const my3p = document.createElement("p");
        my3p.textContent = description;
        article.appendChild(img);
        article.appendChild(h2);
        article.appendChild(h3);
        article.appendChild(my2p);
        article.appendChild(my3p);
        article.appendChild(myIng);


        return article;
    }

    return {getUserCardDOM};
}

function filterByIngredient(recipe) {
    if(ingredients.length === 0){
        return true
    }
    return recipe.ingredients.filter(ingredient => {
        console.log(ingredients.includes(ingredient.ingredient))
        return ingredients.includes(ingredient.ingredient)
    }).length > 0
}

function filterByUstensil(recipe) {
    if(ustensils.length === 0){
        return true
    }
    return recipe.ustensils.filter(ustensil => ustensils.includes(ustensil)).length > 0
}

function filterByAppliance(recipe) {
    if(appliances.length === 0){
        return true
    }
    return appliances.includes(recipe.appliance)
}

function filterByDescription(recipe) {
    if(description === ''){
        return true
    }
    return recipe.description.toLowerCase().includes(description.toLowerCase())
}

function filterByName(recipe) {
    if(query === ''){
        return true
    }
    return recipe.name.toLowerCase().includes(query.toLocaleLowerCase())

}

function filterRecipes() {
    const recipes = allRecipes.filter((recipe) => {
        return (filterByIngredient(recipe) ||
            filterByDescription(recipe) ||
            filterByName(recipe)) &&
            filterByUstensil(recipe) &&
            filterByAppliance(recipe)
    })
    displayData(recipes)
    console.log('data to collect', recipes)
    ingredients.push(...recipes)
    console.log('new array', ingredients)
    
}

    // Get the button, and when the user clicks on it, execute myFunction
    document.getElementById("dropbtn").onclick = function myFunction() {
      document.getElementById("myDropdown").classList.toggle("show");
    }

   // Same for Appareils
   document.getElementById("dropbtn1").onclick = function myFunction() {
    document.getElementById("myDropdown1").classList.toggle("show");
  }
   //Same for Ustensiles
   document.getElementById("dropbtn2").onclick = function myFunction() {
    document.getElementById("myDropdown2").classList.toggle("show");
  }
  

function ingredientsTags(){
    for (var i = 0; i < ingredients.length; i++) {
    var sel = document.createElement("option");
    sel.innerHTML = ingredients[i].ingredient ;
    sel.value  = ingredients[i].ingredient ;
    document.getElementById("state").appendChild(sel);}
}

  
  
  
  
  
  init();


/**
 * TODO:
 * - Remplir les listes d'ingredients / appareils et ustensils
 * - Au click sur un élément d'une des listes, ajouter l'élément au tableau correspondant (ingredients, appliances ou ustensils)
 * - Rappeler la fonction filterRecipes
 */