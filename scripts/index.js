let allRecipes = []
let query = ''
let ingredients = []
let appliances = []
let ustensils = []
let description = []

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
        if(e.target.value.length < 3){
            return
        }
        query = e.target.value
        console.log (query)
        filterRecipes()
        //query = e.target.query.value
        //filterRecipes()
    })
}

async function init() {
    // Récupère les datas des recettes
    const {recipes} = await getRecipes();
    allRecipes = recipes
    console.log('all recipes', recipes)
    displayData(recipes);
    initEventForm()
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
    return recipe.ingredients.filter(ingredient => {
        return ingredients.includes(ingredient.ingredient)
    }).length > 0
}

function filterByDescription(recipe) {
    return recipe.descriptions.filter(description => descriptions.includes(description)).length > 0
}


function filterByName(recipe) {
    return recipe.name.includes(query)

}


function filterRecipes() {
    const recipes = allRecipes.filter((recipe) => {
        return filterByIngredient(recipe) &&
            filterByDescription(recipe) &&
            filterByName(recipe)
    })
    displayData(recipes)
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


  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  init();
