window.onload = async () => {
  const res = await fetch("/recipes");
  const recipes = await res.json();

  for (let recipe of recipes) {
    const url = `http://localhost:8080/recipe.html?id=` + recipe.recipe_id;

    const detailPage = createElement("a");
    detailPage.href = url;
  }
};
