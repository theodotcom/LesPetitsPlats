export function recipeFactory(data) {
  const { name, time, description } = data

  function getRecipeCardDom() {
    const article = document.createElement('article')
    const picture = `assets/logolpp.png`
    const img_container = document.createElement('div')
    img_container.setAttribute('class', 'img_container')
    const img = document.createElement('img')
    img.setAttribute('src', picture)
    const h2 = document.createElement('h2')
    h2.textContent = name
    var myIng = document.createElement('ul')
    myIng.setAttribute('class', 'ingredient_list')
    var ingredients = data['ingredients']
    for (var i = 0; i < ingredients.length; i++) {
      var myPara3 = document.createElement('li')
      if (ingredients[i].ingredient === undefined)
        ingredients[i].ingredient = ''
      if (ingredients[i].quantity === undefined) ingredients[i].quantity = ''
      if (ingredients[i].unit === undefined) ingredients[i].unit = ''
      myPara3.textContent =
        ingredients[i].ingredient +
        ' ' +
        ' : ' +
        ingredients[i].quantity +
        ' ' +
        ingredients[i].unit
      myIng.appendChild(myPara3)
    }
    const details_container = document.createElement('div')
    details_container.setAttribute('class', 'details_container')
    const my2p = document.createElement('p')
    my2p.textContent = time + ' ' + 'min'
    const clock = 'assets/time.svg'
    const img1 = document.createElement('img')
    img1.setAttribute('src', clock)
    const recipe_container = document.createElement('div')
    recipe_container.setAttribute('class', 'recipe_container')
    const my3p = document.createElement('p')
    my3p.textContent = description
    article.appendChild(img_container)
    img_container.appendChild(img)
    article.appendChild(details_container)
    details_container.appendChild(h2)
    details_container.appendChild(img1)
    details_container.appendChild(my2p)
    article.appendChild(recipe_container)
    recipe_container.appendChild(myIng)
    recipe_container.appendChild(my3p)

    return article
  }

  return { getRecipeCardDom }
}

export async function displayData(recipes) {
  const recipeSection = document.querySelector('.recipe_section')
  recipeSection.innerHTML = ''
  if (recipes.length === 0) {
    const h2 = document.createElement('h2')
    h2.textContent = 'Aucun resultat ne correspond à votre recherche'
    recipeSection.appendChild(h2)
  } else {
    recipeSection.innerHTML = ''
    recipes.forEach((recipe) => {
      const recipeModel = recipeFactory(recipe)
      const userCardDOM = recipeModel.getRecipeCardDom()
      recipeSection.appendChild(userCardDOM)
    })
  }
}