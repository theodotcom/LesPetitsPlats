import { recipeFactory } from "../scripts/factory.js"
import { getRecipes } from "../scripts/api.js"

let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = ''
let filteredRecipes = []
let filteredArray = []


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

async function init() {
    // Récupère les datas des recettes
    const {recipes} = await getRecipes();
    allRecipes = recipes
    filteredRecipes = []
    recipes.forEach(r => filteredRecipes.push(r))
    applyTagsToOptions()
    initEventSelect()
    initEventForm()
    displayData(recipes);
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

function applyTagsToOptions() {
    ingredientsTags()
    ustensilsTags()
    appliancesTags()
}

function filterRecipes() {
    const recipes = allRecipes.filter((recipe) => {
        return (filterByName(recipe) || filterByDescription(recipe))  &&
            filterByIngredient(recipe) &&
            filterByUstensil(recipe) &&
            filterByAppliance(recipe)
    })
    filteredRecipes = recipes
    applyTagsToOptions()
    displayData(recipes)
}

function filterRecipesByTags(selectedTag, type){
     filteredRecipes = filteredRecipes.filter((recipe) => {
        switch (type) {
            case 'ingredient':
                return recipe.ingredients.find(y => y.ingredient === selectedTag) ;
            case 'appliance':
                return recipe.appliance == selectedTag ;
            case 'ustensil':
                return recipe.ustensils.find(ustensil => ustensil == selectedTag) ;
            default:
                break;
        }
})
    applyTagsToOptions()
    displayData(filteredRecipes)
}


function ingredientsTags() {
    document.getElementById("filter_ingredients").innerHTML = ''
    let ingredients = filteredRecipes
        .map(recipe => recipe.ingredients
            .map(ingredient => ingredient.ingredient))
        .flat()
    ingredients = [...new Set(ingredients)]
    for (var i = 0; i < ingredients.length; i++) {

            var sel = document.createElement("li");
            sel.innerHTML = ingredients[i]
            sel.value = ingredients[i];
        document.getElementById("filter_ingredients").appendChild(sel);
    }
}

function ustensilsTags() {
    document.getElementById("filter_ustensiles").innerHTML = ''
    let ustensils = filteredRecipes
        .map(recipe => recipe.ustensils)
        .flat()
    ustensils = [...new Set(ustensils)]
    for (var i = 0; i < ustensils.length; i++) {

            var sel = document.createElement("li");
            sel.innerHTML = ustensils[i]
            sel.value = ustensils[i];
        document.getElementById("filter_ustensiles").appendChild(sel);
    }
}

function appliancesTags() {
    document.getElementById("filter_appareils").innerHTML = ''
    let appliances = filteredRecipes
        .map(recipe => recipe.appliance)
        .flat()
    appliances = [...new Set(appliances)]
    for (var i = 0; i < appliances.length; i++) {

            var sel = document.createElement("li");
            sel.innerHTML = appliances[i]
            sel.value = appliances[i];

        document.getElementById("filter_appareils").appendChild(sel);
    }
}



function addTagElement(value, callback){
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




function initEventSelect(){
    document.querySelector('#filter_ingredients').addEventListener('change', (e) => {
        ingredients.push(e.target.value)
        addTagElement(e.target.value, (value) => {
            ingredients = ingredients.filter(i => i !== value)
        })
        filterRecipes()
    })

    document.querySelector('#Appareils').addEventListener('change', (e) => {
        appliances.push(e.target.value)
        addTagElement(e.target.value, (value) => {
            appliances = appliances.filter(i => i !== value)
        })
        filterRecipes()
    })

    document.querySelector('#Ustensiles').addEventListener('change', (e) => {
        ustensils.push(e.target.value)
        addTagElement(e.target.value, (value) => {
            ustensils = ustensils.filter(i => i !== value)
        })
        filterRecipes()
    })
}

const el1 = document.getElementById("filter_ingredients")

document.querySelector('.filter__select--ingredients').addEventListener('click', ()=>{
    if (el1.style.display === "none"){
        el1.style.display = "block";
        }else{
            el1.style.display = "none"
        }

})

const el2 = document.getElementById("filter_appareils")

document.querySelector('.filter__select--appareils').addEventListener('click', ()=>{
    if (el2.style.display === "none"){
        el2.style.display = "block";
        }else{
            el2.style.display = "none"
        }

})

const el3 = document.getElementById("filter_ustensiles")

document.querySelector('.filter__select--ustensiles').addEventListener('click', ()=>{
    if (el3.style.display === "none"){
        el3.style.display = "block";
        }else{
            el3.style.display = "none"
        }

})

init();