import { recipeFactory } from "../scripts/factory.js";
import { getRecipes } from "../scripts/api.js";

let allRecipes = [];
let query = "";
let ingredients = [];
let appliances = [];
let ustensils = [];
let description = "";
let filteredRecipes = [];

async function displayData(recipes) {
  const recipeSection = document.querySelector(".recipe_section");
  recipeSection.innerHTML = "";
  if (recipes.length === 0){
  const h2 = document.createElement("h2");
    h2.textContent = "Aucun resultat ne correspond à votre recherche";
    recipeSection.appendChild(h2);
    } else {
  recipeSection.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeModel = recipeFactory(recipe);
    const userCardDOM = recipeModel.getUserCardDOM();
    recipeSection.appendChild(userCardDOM);  
  })}
}

function initEventForm() {
  const researchBar = document.querySelector(".research_bar input");
  researchBar.addEventListener("input", (e) => {
    e.preventDefault();
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return;
    }
    query = e.target.value.trim();
    description = e.target.value.trim();
    filterRecipes();
  });
}

function InitIngredientTagForm() {
  const ingredientSearchBar = document.querySelector(
    ".filter__select--ingredients"
  );
  ingredientSearchBar.addEventListener("change", (e) => {
    e.preventDefault();
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return;
    }
    document.querySelector(".filter_ingredients").innerHTML = "";
    const filterIngredients = getFilteredIngredients();
    let filteredSearchIng = filterIngredients.filter((w) =>
      w.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(filteredSearchIng);

    for (var i = 0; i < filteredSearchIng.length; i++) {
      var sel = document.createElement("li");
      sel.innerHTML = filteredSearchIng[i];
      document.querySelector(".filter_ingredients").appendChild(sel);
      ingredientTagEvent(filteredSearchIng[i], sel);
    }
  });
}

function InitUstensilesTagForm() {
  const ingredientSearchBar = document.querySelector(
    ".filter__select--ustensiles"
  );
  ingredientSearchBar.addEventListener("change", (e) => {
    e.preventDefault();
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return;
    }
    document.querySelector(".filter_ustensiles").innerHTML = "";
    const filteredUstensiles = getFilteredUstensiles();
    let filteredSearchUstensiles = filteredUstensiles.filter((q) =>
      q.toLowerCase().includes(e.target.value.toLowerCase())
    );
    for (var i = 0; i < filteredSearchUstensiles.length; i++) {
      var sel = document.createElement("li");
      sel.innerHTML = filteredSearchUstensiles[i];
      sel.value = filteredSearchUstensiles[i];
      document.querySelector(".filter_ustensiles").appendChild(sel);
      ustensilTagEvent(filteredSearchUstensiles[i], sel);
    }
  });
}

function InitAppliancesTagForm() {
  const ingredientSearchBar = document.querySelector(
    ".filter__select--appareils"
  );
  ingredientSearchBar.addEventListener("change", (e) => {
    e.preventDefault();
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return;
    }
    document.querySelector(".filter_appareils").innerHTML = "";
    const filteredAppliances = getFilteredAppliances();
    let filteredSearchAppliances = filteredAppliances.filter((z) =>
      z.toLowerCase().includes(e.target.value.toLowerCase())
    );
    for (var i = 0; i < filteredSearchAppliances.length; i++) {
      var sel = document.createElement("li");
      sel.innerHTML = filteredSearchAppliances[i];
      sel.value = filteredSearchAppliances[i];

      document.querySelector(".filter_appareils").appendChild(sel);
      applianceTagEvent(filteredSearchAppliances[i], sel);
    }
  });
}

async function init() {
  // Récupère les datas des recettes
  const { recipes } = await getRecipes();
  allRecipes = recipes;
  console.log(allRecipes)
  filteredRecipes = [];
  recipes.forEach((r) => filteredRecipes.push(r));
  applyTagsToOptions();
  initEventForm();
  InitTagsForms();
  displayData(recipes);
}

function filterByIngredient(recipe) {
  if (ingredients.length === 0) {
    return true;
  }

  return (
    recipe.ingredients.filter((ingredient) => {
      return ingredients.includes(ingredient.ingredient);
    }).length === ingredients.length
  );
}

function filterByUstensil(recipe) {
  if (ustensils.length === 0) {
    return true;
  }
  return (
    recipe.ustensils.filter((ustensil) => ustensils.includes(ustensil))
      .length === ustensils.length
  );
}

function filterByAppliance(recipe) {
  if (appliances.length === 0) {
    return true;
  }
  return appliances.includes(recipe.appliance);
}

function filterByDescription(recipe) {
  if (description === "") {
    return true;
  }
  return recipe.description.toLowerCase().includes(description.toLowerCase());
}

function filterByName(recipe) {
  if (query === "") {
    return true;
  }
  return recipe.name.toLowerCase().includes(query.toLocaleLowerCase());
}

function InitTagsForms() {
  InitAppliancesTagForm();
  InitIngredientTagForm();
  InitUstensilesTagForm();
}

function applyTagsToOptions() {
  ingredientsTags();
  ustensilsTags();
  appliancesTags();
}

function filterRecipes() {
  const recipes = allRecipes.filter((recipe) => {
    return (
      (filterByName(recipe) || filterByDescription(recipe)) &&
      // cf fonction et ce qu'elles retournent
      filterByIngredient(recipe) &&
      filterByUstensil(recipe) &&
      filterByAppliance(recipe)
    );
  });
  filteredRecipes = recipes;
  applyTagsToOptions();
  displayData(recipes);
}


function getFilteredIngredients() {
  let filterIngredients = filteredRecipes
    .map((recipe) =>
      recipe.ingredients.map((ingredient) => ingredient.ingredient)
    )
    .flat();
  return [...new Set(filterIngredients)];
}

function getFilteredUstensiles() {
  let ustensils = filteredRecipes.map((recipe) => recipe.ustensils).flat();
  return [...new Set(ustensils)];
}

function getFilteredAppliances() {
  let appliances = filteredRecipes.map((recipe) => recipe.appliance).flat();
  return [...new Set(appliances)];
}


function ingredientTagEvent(ingredient, element) {
  element.addEventListener("click", () => {
    ingredients.push(ingredient);
    addTagElementIngredient(ingredient, (value) => {
      ingredients = ingredients.filter((i) => i !== value);
    });
    filterRecipes();
  });
}

function ingredientsTags() {
  document.querySelector(".filter_ingredients").innerHTML = "";
  const filterIngredients = getFilteredIngredients();
  for (var i = 0; i < filterIngredients.length; i++) {
    var sel = document.createElement("li");
    sel.innerHTML = filterIngredients[i];
    document.querySelector(".filter_ingredients").appendChild(sel);
    ingredientTagEvent(filterIngredients[i], sel);
  }
}

function ustensilTagEvent(ustensil, element) {
  element.addEventListener("click", () => {
    ustensils.push(ustensil);
    addTagElementUstensil(ustensil, (value) => {
      ustensils = ustensils.filter((i) => i !== value);
    });
    filterRecipes();
  });
}

function ustensilsTags() {
  document.querySelector(".filter_ustensiles").innerHTML = "";
  const ustensils = getFilteredUstensiles();
  for (var i = 0; i < ustensils.length; i++) {
    var sel = document.createElement("li");
    sel.innerHTML = ustensils[i];
    sel.value = ustensils[i];
    document.querySelector(".filter_ustensiles").appendChild(sel);
    ustensilTagEvent(ustensils[i], sel);
  }
}

function applianceTagEvent(appliance, element) {
  element.addEventListener("click", () => {
    appliances.push(appliance);
    addTagElementAppliance(appliance, (value) => {
      appliances = appliances.filter((i) => i !== value);
    });
    filterRecipes();
  });
}

function appliancesTags() {
  document.querySelector(".filter_appareils").innerHTML = "";
  const appliances = getFilteredAppliances(); 
  for (var i = 0; i < appliances.length; i++) {
    var sel = document.createElement("li");
    sel.innerHTML = appliances[i];
    sel.value = appliances[i];

    document.querySelector(".filter_appareils").appendChild(sel);
    applianceTagEvent(appliances[i], sel);
  }
}

function addTagElementAppliance(appliance, callback) {
  const tags = document.querySelector("#tags");
  const elmt_container = document.createElement("div");
  elmt_container.classList.add("applianceList");
  const element1 = document.createElement("li");
  const img_close = "assets/remove-icon.png";
  const elmt_close = document.createElement("img");
  elmt_close.setAttribute("src", img_close);
  element1.innerText = appliance;
  element1.addEventListener("click", () => {
    elmt_container.remove();
    callback(appliance);
    filterRecipes();
  });
  tags.appendChild(elmt_container);
  elmt_container.appendChild(element1);
  elmt_container.appendChild(elmt_close);
}

function addTagElementUstensil(ustensil, callback) {
  const tags = document.querySelector("#tags");
  const elmt_container = document.createElement("div");
  elmt_container.classList.add("ustensilList");
  const element2 = document.createElement("li");
  const img_close = "assets/remove-icon.png";
  const elmt_close = document.createElement("img");
  elmt_close.setAttribute("src", img_close);
  element2.innerText = ustensil;
  element2.addEventListener("click", () => {
    elmt_container.remove();
    callback(ustensil);
    filterRecipes();
  });
  tags.appendChild(elmt_container);
  elmt_container.appendChild(element2);
  elmt_container.appendChild(elmt_close);
}
function addTagElementIngredient(ingredient, callback) {
  const tags = document.querySelector("#tags");
  const elmt_container = document.createElement("div");
  elmt_container.classList.add("ingredientList");
  const element3 = document.createElement("li");
  const img_close = "assets/remove-icon.png";
  const elmt_close = document.createElement("img");
  elmt_close.setAttribute("src", img_close);
  element3.innerText = ingredient;
  element3.addEventListener("click", () => {
    elmt_container.remove();
    callback(ingredient);
    filterRecipes();
  });
  tags.appendChild(elmt_container);
  elmt_container.appendChild(element3);
  elmt_container.appendChild(elmt_close);
}



const el1 = document.querySelector(".filter_ingredients");
const el2 = document.querySelector(".filter_appareils");
const el3 = document.querySelector(".filter_ustensiles");

document
  .querySelector(".filter__select--ingredients")
  .addEventListener("click", () => {
    if (el1.style.display === "none") {
      el1.style.display = "flex";
      el2.style.display = "none";
      el3.style.display = "none";
    } else {
      el1.style.display = "none";
    }
  });
  
document
  .querySelector(".filter__select--appareils")
  .addEventListener("click", () => {
    if (el2.style.display === "none") {
      el2.style.display = "flex";
      el1.style.display = "none";
      el3.style.display = "none";
    } else {
      el2.style.display = "none";
    }
  });



document
  .querySelector(".filter__select--ustensiles")
  .addEventListener("click", () => {
    if (el3.style.display === "none") {
      el3.style.display = "flex";
      el2.style.display = "none";
      el1.style.display = "none";
    } 
    else {
      el3.style.display = "none";
    }
  });


init();
