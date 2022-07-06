import {recipeFactory} from "../scripts/factory.js"
import {getRecipes} from "../scripts/api.js"

let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = ''
let filteredRecipes = []


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
        if (e.target.value.length > 0 && e.target.value.length < 3) {
            return
        }
        query = e.target.value
        description = e.target.value
        filterRecipes()
    })
}

// function InitIngredientTagForm(){
//     const ingredientSearchBar = document.querySelector('.filter__custom-arrow input')
//     ingredientSearchBar.addEventListener('input', (e)=>{
//         e.preventDefault()
//         if (e.target.value.length > 0 && e.target.value.length < 3) {
//             return
//     }
//     ingredientsTags()
// })
// }


async function init() {
    // Récupère les datas des recettes
    const {recipes} = await getRecipes();
    allRecipes = recipes
    filteredRecipes = []
    recipes.forEach(r => filteredRecipes.push(r))
    applyTagsToOptions()
    initEventForm()
    displayData(recipes);
}


function filterByIngredient(recipe) {
    if (ingredients.length === 0) {
        return true
    }

    return recipe.ingredients.filter(ingredient => {
        return ingredients.includes(ingredient.ingredient)
    }).length === ingredients.length
}

function filterByUstensil(recipe) {
    if (ustensils.length === 0) {
        return true
    }
    return recipe.ustensils.filter(ustensil => ustensils.includes(ustensil)).length === ustensils.length
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

function applyTagsToOptions() {
    ingredientsTags()
    ustensilsTags()
    appliancesTags()
}

function filterRecipes() {
    const recipes = allRecipes.filter((recipe) => {
        return (filterByName(recipe) || filterByDescription(recipe)) &&
            filterByIngredient(recipe) &&
            filterByUstensil(recipe) &&
            filterByAppliance(recipe)
    })
    filteredRecipes = recipes
    applyTagsToOptions()
    displayData(recipes)
}



function ingredientTagEvent(ingredient, element){
    element.addEventListener('click', () => {
        ingredients.push(ingredient)
        addTagElement(ingredient, (value) => {
            ingredients = ingredients.filter(i => i !== value)
        })
        filterRecipes()
    })
}

function ingredientsTags() {
    document.querySelector(".filter_ingredients").innerHTML = ''
    let filterIngredients = filteredRecipes
        .map(recipe => recipe.ingredients
            .map(ingredient => ingredient.ingredient))
        .flat()
    filterIngredients = [...new Set(filterIngredients)]
    for (var i = 0; i < filterIngredients.length; i++) {

        var sel = document.createElement("li");
        sel.innerHTML = filterIngredients[i]
        document.querySelector(".filter_ingredients").appendChild(sel);
        ingredientTagEvent(filterIngredients[i], sel)
    }
}

function ustensilTagEvent(ustensil, element){
    element.addEventListener('click', () => {
        ustensils.push(ustensil)
        addTagElement(ustensil, (value) => {
            ustensils = ustensils.filter(i => i !== value)
        })
        filterRecipes()
    })
}

function ustensilsTags() {
    document.querySelector(".filter_ustensiles").innerHTML = ''
    let ustensils = filteredRecipes
        .map(recipe => recipe.ustensils)
        .flat()
    ustensils = [...new Set(ustensils)]
    for (var i = 0; i < ustensils.length; i++) {
        var sel = document.createElement("li");
        sel.innerHTML = ustensils[i]
        sel.value = ustensils[i];
        document.querySelector(".filter_ustensiles").appendChild(sel);
        ustensilTagEvent(ustensils[i], sel)
    }
}

function applianceTagEvent(appliance, element){
    element.addEventListener('click', () => {
        appliances.push(appliance)
        addTagElement(appliance, (value) => {
            appliances = appliances.filter(i => i !== value)
        })
        filterRecipes()
    })
}

function appliancesTags() {
    document.querySelector(".filter_appareils").innerHTML = ''
    let appliances = filteredRecipes
        .map(recipe => recipe.appliance)
        .flat()
    appliances = [...new Set(appliances)]
    for (var i = 0; i < appliances.length; i++) {

        var sel = document.createElement("li");
        sel.innerHTML = appliances[i]
        sel.value = appliances[i];

        document.querySelector(".filter_appareils").appendChild(sel);
        applianceTagEvent(appliances[i], sel)
    }
}


function addTagElement(value, callback) {
    const tags = document.querySelector('#tags')
    const element = document.createElement('li')
    element.innerText = value
    element.addEventListener('click', (e) => {
        e.target.remove()
        callback(value)
        filterRecipes()
    })
    tags.appendChild(element)
}

const el1 = document.querySelector(".filter_ingredients")

document.querySelector('.filter__select--ingredients').addEventListener('click', () => {
    if (el1.style.display === "none") {
        el1.style.display = "grid";
    } else {
        el1.style.display = "none"
    }

})

const el2 = document.querySelector(".filter_appareils")

document.querySelector('.filter__select--appareils').addEventListener('click', () => {
    if (el2.style.display === "none") {
        el2.style.display = "grid";
    } else {
        el2.style.display = "none"
    }

})

const el3 = document.querySelector(".filter_ustensiles")

document.querySelector('.filter__select--ustensiles').addEventListener('click', () => {
    if (el3.style.display === "none") {
        el3.style.display = "grid";
    } else {
        el3.style.display = "none"
    }

})

init();