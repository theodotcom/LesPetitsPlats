import { getRecipes } from '../scripts/api.js'
import { displayData } from '../scripts/factory.js'

let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = ''
let filteredRecipes = []

function InitSearchBarForm() {
  const researchBar = document.querySelector('.research_bar input')
  researchBar.addEventListener('input', (e) => {
    e.preventDefault()
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return
    }
    query = e.target.value.trim()
    description = e.target.value.trim()
    filterRecipes()
  })
}

async function init() {
  // Récupère les datas des recettes
  const { recipes } = await getRecipes()
  allRecipes = recipes
  filteredRecipes = []
  recipes.forEach((r) => filteredRecipes.push(r))
  applyTagsToOptions()
  InitSearchBarForm()
  InitTagsForms()
  displayData(recipes)
}

// Search from the ingredients'searchBar
function InitIngredientTagForm() {
  const ingredientSearchBar = document.querySelector(
    '.filter__select--ingredients'
  )
  ingredientSearchBar.addEventListener('change', (e) => {
    e.preventDefault()
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return
    }
    document.querySelector('.filter_ingredients').innerHTML = ''
    const filterIngredients = getFilteredIngredients()
    let filteredSearchIng = filterIngredients.filter((w) =>
      w.toLowerCase().includes(e.target.value.toLowerCase())
    )
    for (var i = 0; i < filteredSearchIng.length; i++) {
      var sel = document.createElement('li')
      sel.innerHTML = filteredSearchIng[i]
      document.querySelector('.filter_ingredients').appendChild(sel)
      ingredientTagEvent(filteredSearchIng[i], sel)
    }
  })
}

function InitUstensilesTagForm() {
  const ingredientSearchBar = document.querySelector(
    '.filter__select--ustensiles'
  )
  ingredientSearchBar.addEventListener('change', (e) => {
    e.preventDefault()
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return
    }
    document.querySelector('.filter_ustensiles').innerHTML = ''
    const filteredUstensiles = getFilteredUstensiles()
    let filteredSearchUstensiles = filteredUstensiles.filter((q) =>
      q.toLowerCase().includes(e.target.value.toLowerCase())
    )
    for (var i = 0; i < filteredSearchUstensiles.length; i++) {
      var sel = document.createElement('li')
      sel.innerHTML = filteredSearchUstensiles[i]
      sel.value = filteredSearchUstensiles[i]
      document.querySelector('.filter_ustensiles').appendChild(sel)
      ustensilTagEvent(filteredSearchUstensiles[i], sel)
    }
  })
}

function InitAppliancesTagForm() {
  const ingredientSearchBar = document.querySelector(
    '.filter__select--appareils'
  )
  ingredientSearchBar.addEventListener('change', (e) => {
    e.preventDefault()
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return
    }
    document.querySelector('.filter_appareils').innerHTML = ''
    const filteredAppliances = getFilteredAppliances()
    let filteredSearchAppliances = filteredAppliances.filter((z) =>
      z.toLowerCase().includes(e.target.value.toLowerCase())
    )
    for (var i = 0; i < filteredSearchAppliances.length; i++) {
      var sel = document.createElement('li')
      sel.innerHTML = filteredSearchAppliances[i]
      sel.value = filteredSearchAppliances[i]

      document.querySelector('.filter_appareils').appendChild(sel)
      applianceTagEvent(filteredSearchAppliances[i], sel)
    }
  })
}

function InitTagsForms() {
  InitAppliancesTagForm()
  InitIngredientTagForm()
  InitUstensilesTagForm()
}

//Main filter
function filterRecipes() {
  const recipes = allRecipes.filter((recipe) => {
    return (
      (filterByName(recipe) || filterByDescription(recipe)) &&
      filterByIngredient(recipe) &&
      filterByUstensil(recipe) &&
      filterByAppliance(recipe)
    )
  })
  filteredRecipes = recipes
  applyTagsToOptions()
  displayData(recipes)
}

//Each filter

function filterByIngredient(recipe) {
  if (ingredients.length === 0) {
    return true
  }

  return (
    recipe.ingredients.filter((ingredient) => {
      return ingredients.includes(ingredient.ingredient)
    }).length === ingredients.length
  )
}

function filterByUstensil(recipe) {
  if (ustensils.length === 0) {
    return true
  }
  return (
    recipe.ustensils.filter((ustensil) => ustensils.includes(ustensil))
      .length === ustensils.length
  )
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

//Get the filtered list of ingredients, ustensils & appliances after a search
// to create new arrays with the filtereds's results -->filterX
// and use them to show only the left results

function getFilteredIngredients() {
  let filterIngredients = filteredRecipes
    .map((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    )
    .flat()
  return [...new Set(filterIngredients)]
}

function getFilteredUstensiles() {
  let ustensils = filteredRecipes.map((recipe) => recipe.ustensils).flat()
  return [...new Set(ustensils)]
}

function getFilteredAppliances() {
  let appliances = filteredRecipes.map((recipe) => recipe.appliance).flat()
  return [...new Set(appliances)]
}

// Show the list of filterX from getFilteredX

function ingredientsTags() {
  document.querySelector('.filter_ingredients').innerHTML = ''
  const filterIngredients = getFilteredIngredients()
  for (var i = 0; i < filterIngredients.length; i++) {
    var sel = document.createElement('li')
    sel.innerHTML = filterIngredients[i]
    document.querySelector('.filter_ingredients').appendChild(sel)
    ingredientTagEvent(filterIngredients[i], sel)
  }
}

function ustensilsTags() {
  document.querySelector('.filter_ustensiles').innerHTML = ''
  const ustensils = getFilteredUstensiles()
  for (var i = 0; i < ustensils.length; i++) {
    var sel = document.createElement('li')
    sel.innerHTML = ustensils[i]
    sel.value = ustensils[i]
    document.querySelector('.filter_ustensiles').appendChild(sel)
    ustensilTagEvent(ustensils[i], sel)
  }
}

function appliancesTags() {
  document.querySelector('.filter_appareils').innerHTML = ''
  const appliances = getFilteredAppliances()
  for (var i = 0; i < appliances.length; i++) {
    var sel = document.createElement('li')
    sel.innerHTML = appliances[i]
    sel.value = appliances[i]

    document.querySelector('.filter_appareils').appendChild(sel)
    applianceTagEvent(appliances[i], sel)
  }
}

function applyTagsToOptions() {
  ingredientsTags()
  ustensilsTags()
  appliancesTags()
}

// Allow clicks on elements from the list
// and filter the recipes with the new element clicked on

function ingredientTagEvent(ingredient, element) {
  element.addEventListener('click', () => {
    ingredients.push(ingredient)
    addTagElementIngredient(ingredient, (value) => {
      ingredients = ingredients.filter((i) => i !== value)
    })
    filterRecipes()
  })
}

function ustensilTagEvent(ustensil, element) {
  element.addEventListener('click', () => {
    ustensils.push(ustensil)
    addTagElementUstensil(ustensil, (value) => {
      ustensils = ustensils.filter((i) => i !== value)
    })
    filterRecipes()
  })
}

function applianceTagEvent(appliance, element) {
  element.addEventListener('click', () => {
    appliances.push(appliance)
    addTagElementAppliance(appliance, (value) => {
      appliances = appliances.filter((i) => i !== value)
    })
    filterRecipes()
  })
}

// Allows to create a tag and delete it onclick and then filter the recipes

function addTagElementIngredient(ingredient, callback) {
  const tags = document.querySelector('#tags')
  const elmt_container = document.createElement('div')
  elmt_container.classList.add('ingredientList')
  const element3 = document.createElement('li')
  const img_close = 'assets/remove-icon.png'
  const elmt_close = document.createElement('img')
  elmt_close.setAttribute('src', img_close)
  element3.innerText = ingredient
  element3.addEventListener('click', () => {
    elmt_container.remove()
    callback(ingredient)
    filterRecipes()
  })
  tags.appendChild(elmt_container)
  elmt_container.appendChild(element3)
  elmt_container.appendChild(elmt_close)
}

function addTagElementAppliance(appliance, callback) {
  const tags = document.querySelector('#tags')
  const elmt_container = document.createElement('div')
  elmt_container.classList.add('applianceList')
  const element1 = document.createElement('li')
  const img_close = 'assets/remove-icon.png'
  const elmt_close = document.createElement('img')
  elmt_close.setAttribute('src', img_close)
  element1.innerText = appliance
  element1.addEventListener('click', () => {
    elmt_container.remove()
    callback(appliance)
    filterRecipes()
  })
  tags.appendChild(elmt_container)
  elmt_container.appendChild(element1)
  elmt_container.appendChild(elmt_close)
}

function addTagElementUstensil(ustensil, callback) {
  const tags = document.querySelector('#tags')
  const elmt_container = document.createElement('div')
  elmt_container.classList.add('ustensilList')
  const element2 = document.createElement('li')
  const img_close = 'assets/remove-icon.png'
  const elmt_close = document.createElement('img')
  elmt_close.setAttribute('src', img_close)
  element2.innerText = ustensil
  element2.addEventListener('click', () => {
    elmt_container.remove()
    callback(ustensil)
    filterRecipes()
  })
  tags.appendChild(elmt_container)
  elmt_container.appendChild(element2)
  elmt_container.appendChild(elmt_close)
}

//Showing or not the lists on input's focus

const filterIngredientInput = document.querySelector(
  '#filter_ingredients input'
)
const filterUstensilsInput = document.querySelector('#filter_ustensils input')
const filterAppareilsInput = document.querySelector('#filter_appareils input')

;[filterIngredientInput, filterUstensilsInput, filterAppareilsInput].forEach(
  (input) => {
    input.addEventListener('focus', (e) => {
      e.target.parentElement.classList.add('filter_show')
    })

    input.addEventListener('focusout', (e) => {
      setTimeout(() => {
        e.target.parentElement.classList.remove('filter_show')
      }, 10)
    })
  }
)

init()
