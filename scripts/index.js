let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = ''
let filteredRecipes = []

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
}

function initEventForm() {
    const researchBar = document.querySelector('.research_bar input')
    researchBar.addEventListener('input', (e) => {
        e.preventDefault()
        if (e.target.value.length === 0) {
            displayData(allRecipes)
            return
        }
        if (e.target.value.length < 3) {
            return
        }
        query = e.target.value
        description = e.target.value
        //ingredients = [e.target.value]
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
    ingredientsTags()
    ustensilsTags()
    appliancesTags()
    initEventSelect()
}


function recipeFactory(data) {
    const {name, time, description} = data;

    function getUserCardDOM() {
        const article = document.createElement("article");
        const picture = `assets/logolpp.png`;
        const img_container = document.createElement("div");
        img_container.setAttribute('class', 'img_container');
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        const h2 = document.createElement("h2");
        h2.textContent = name;
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
        const details_container = document.createElement('div');
        details_container.setAttribute('class', 'details_container');
        const my2p = document.createElement("p");
        my2p.textContent = time + " " + "min";
        const recipe_container = document.createElement("div");
        recipe_container.setAttribute('class', 'recipe_container');
        const my3p = document.createElement("p");
        my3p.textContent = description;
        article.appendChild(img_container);
        img_container.appendChild(img);
        article.appendChild(details_container);
        details_container.appendChild(h2);
        details_container.appendChild(my2p);
        article.appendChild(recipe_container);
        recipe_container.appendChild(myIng);
        recipe_container.appendChild(my3p);


        return article;
    }

    return {getUserCardDOM};
}


function filterByIngredient(recipe) {
    if (ingredients.length === 0) {
        return true
    }
    return recipe.ingredients.filter(ingredient => {
        return ingredients.includes(ingredient.ingredient)
    }).length > 0
}

function filterByUstensil(recipe) {
    if (ustensils.length === 0) {
        return true
    }
    return recipe.ustensils.filter(ustensil => ustensils.includes(ustensil)).length > 0
}

function filterByAppliance(recipe) {
    if (appliances.length === 0) {
        return true
    }
    return appliances.includes(recipe.appliance)
}

function filterByDescription(recipe) {
    if (description === '') {
        return true
    }
    return recipe.description.toLowerCase().includes(description.toLowerCase())
}

function filterByName(recipe) {
    if (query === '') {
        return true
    }
    return recipe.name.toLowerCase().includes(query.toLocaleLowerCase())

}

function filterRecipes() {
    const recipes = allRecipes.filter((recipe) => {
        return (filterByName(recipe) || filterByDescription(recipe))  &&
            filterByIngredient(recipe) &&
            filterByUstensil(recipe) &&
            filterByAppliance(recipe)
    })
    displayData(recipes)
    ingredientsTags()
    filteredRecipes = recipes
}

console.log('new obj1', ingredients)
console.log('new obj2', ustensils)


function ingredientsTags() {
    document.getElementById("Ingredients").innerHTML = ''
    let ingredients = filteredRecipes
        .map(recipe => recipe.ingredients
            .map(ingredient => ingredient.ingredient))
        .flat()
    ingredients = [...new Set(ingredients)]
    for (var i = 0; i < ingredients.length; i++) {
        var sel = document.createElement("option");
        sel.innerHTML = ingredients[i]
        sel.value = ingredients[i];
        document.getElementById("Ingredients").appendChild(sel);
    }
}

function ustensilsTags() {
    let ustensils = filteredRecipes
        .map(recipe => recipe.ustensils)
        .flat()
    ustensils = [...new Set(ustensils)]
    for (var i = 0; i < ustensils.length; i++) {
        var sel = document.createElement("option");
        sel.innerHTML = ustensils[i]
        sel.value = ustensils[i];
        document.getElementById("Ustensiles").appendChild(sel);
    }
}

function appliancesTags() {
    let appliances = filteredRecipes
        .map(recipe => recipe.appliance)
    appliances = [...new Set(appliances)]
    for (var i = 0; i < appliances.length; i++) {
        var sel = document.createElement("option");
        sel.innerHTML = appliances[i]
        sel.value = appliances[i];
        document.getElementById("Appareils").appendChild(sel);
    }
}

function addTagElement(value, callback){
    const tags = document.querySelector('#tags')
    const element = document.createElement('li')
    element.innerText = value
    element.addEventListener('click', (e) => {
        callback()
        e.target.remove()
    })
    tags.appendChild(element)
}

function initEventSelect(){
    document.querySelector('#Ingredients').addEventListener('change', (e) => {
        ingredients.push(e.target.value)
        addTagElement(e.target.value, () => {
            ingredients = ingredients.filter(i => i !== e.target.value)
            filterRecipes()
        })
        filterRecipes()
    })

    document.querySelector('#Appareils').addEventListener('change', (e) => {
        appliances.push(e.target.value)
        addTagElement(e.target.value, () => {
            appliances = appliances.filter(i => i !== e.target.value)
            filterRecipes()
        })
        filterRecipes()
    })

    document.querySelector('#Ustensiles').addEventListener('change', (e) => {
        ustensils.push(e.target.value)
        addTagElement(e.target.value, () => {
            ustensils = ustensils.filter(i => i !== e.target.value)
            filterRecipes()
        })
        filterRecipes()
    })
}


init();
