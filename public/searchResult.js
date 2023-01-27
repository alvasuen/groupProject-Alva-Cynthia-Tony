let showRepMode = false;

//
const search = document.querySelector(".search");
search.addEventListener("click", function () {
  document.querySelector(".search-header").classList.remove("hidden");
});

// const cancel = document.querySelector(".cancel");
// cancel.addEventListener("click", function () {
//   document.querySelector(".search-header").classList.add("hidden");
// });


//the button to show all recipes
let allRecipesBtn = document.querySelector("#allRecipes");
allRecipesBtn.addEventListener("click", async () => {
  if (!showRepMode) {
    showRepMode = true;
    allRecipesBtn.style.backgroundColor = "black";
    allRecipesBtn.style.color = "white";
    let rawData = await fetch("/search_data");
    console.log(rawData);
    let json = await rawData.json();

    if (!json.success) {
      alert(`${json.message}`);
    } else {
      for (let i = 0; i < json.content.recipes.rowCount; i++) {
        let a = document.createElement("a");
        a.href = "#";
        let newBlock = document.createElement("div");
        newBlock.className = "resultDisplayBlock";
        let newImageBlock = document.createElement("div");
        newImageBlock.className = "imgBlock";
        let newTextBlock = document.createElement("div");
        newTextBlock.className = "textBlock";
        let newCookingLv = document.createElement("div");
        newCookingLv.className = "cookingLv";
        newCookingLv.innerHTML = json.content.recipes.rows[i].cooking_level.toUpperCase();
        let newImageContainer = document.createElement("div");
        newImageContainer.className = "resultImage";
        let newImage = document.createElement("img");
        newImage.src = json.content.recipes.rows[i].image;
        console.log(json.content.recipes.rows[i].image);
        let newResultHeadline = document.createElement("div");
        newResultHeadline.className = "resultHeadline";
        newResultHeadline.innerHTML = json.content.recipes.rows[i].recipe_name;
        let newResultBriefContent = document.createElement("div");
        newResultBriefContent.className = "resultBriefContent";
        newResultBriefContent.innerHTML =
          json.content.recipes.rows[i].recipe_description;

        document.getElementById("result").appendChild(a);
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
      }
    }
  } else if (showRepMode) {
    let result = document.getElementById("result");
    result.innerHTML = "";
    allRecipesBtn.style.backgroundColor = "#f0f0f0d2";
    allRecipesBtn.style.color = "black";
    showRepMode = false;
  }
  let clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", () => {
    let result = document.getElementById("result");
    result.innerHTML = "";
    allRecipesBtn.style.backgroundColor = "#f0f0f0d2";
    allRecipesBtn.style.color = "black";
  });
});

//tag (type1)
let buttons = document.querySelectorAll(".buttonType1");
buttons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    button.style.backgroundColor = "black";
    button.style.color = "white";
    let res = await fetch("/tag1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: event.target.textContent }),
    });
    let json = await res.json();
    console.log(json);
    console.log(json.content[0].recipe_name);
    if (!json.success) {
      alert(`${json.message}`);
    } else if (json.success) {
      for (let i = 0; i < json.content.length; i++) {
        let a = document.createElement("a");
        a.href = "#";
        let newBlock = document.createElement("div");
        newBlock.className = "resultDisplayBlock";
        let newImageBlock = document.createElement("div");
        newImageBlock.className = "imgBlock";
        let newTextBlock = document.createElement("div");
        newTextBlock.className = "textBlock";
        let newCookingLv = document.createElement("div");
        newCookingLv.className = "cookingLv";
        newCookingLv.innerHTML = json.content[i].cooking_level.toUpperCase();
        let newImageContainer = document.createElement("div");
        newImageContainer.className = "resultImage";
        let newImage = document.createElement("img");
        newImage.src = json.content[i].image;
        let newResultHeadline = document.createElement("div");
        newResultHeadline.className = "resultHeadline";
        newResultHeadline.innerHTML = json.content[i].recipe_name;
        let newResultBriefContent = document.createElement("div");
        newResultBriefContent.className = "resultBriefContent";
        newResultBriefContent.innerHTML = json.content[i].recipe_description;

        document.getElementById("result").appendChild(a);
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
      }
    }
  });
  let clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", () => {
    let result = document.getElementById("result");
    result.innerHTML = "";
    button.style.backgroundColor = "#f0f0f0d2";
    button.style.color = "black";
  });
});


//tag (cooking level)
let buttons3 = document.querySelectorAll(".cooking_level");
buttons3.forEach((button) => {
  button.addEventListener("click", async (event) => {
    button.style.backgroundColor = "black";
    button.style.color = "white";
    let res = await fetch("/tag3", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: event.target.textContent }),
    });
    let json = await res.json();
    if (!json.success) {
      alert(`${json.message}`);
    } else if (json.success) {
      for (let i = 0; i < json.content.length; i++) {
        let a = document.createElement("a");
        a.href = "#";
        let newBlock = document.createElement("div");
        newBlock.className = "resultDisplayBlock";
        let newImageBlock = document.createElement("div");
        newImageBlock.className = "imgBlock";
        let newTextBlock = document.createElement("div");
        newTextBlock.className = "textBlock";
        let newCookingLv = document.createElement("div");
        newCookingLv.className = "cookingLv";
        newCookingLv.innerHTML = json.content[i].cooking_level.toUpperCase();
        let newImageContainer = document.createElement("div");
        newImageContainer.className = "resultImage";
        let newImage = document.createElement("img");
        newImage.src = json.content[i].image;
        let newResultHeadline = document.createElement("div");
        newResultHeadline.className = "resultHeadline";
        newResultHeadline.innerHTML = json.content[i].recipe_name;
        let newResultBriefContent = document.createElement("div");
        newResultBriefContent.className = "resultBriefContent";
        newResultBriefContent.innerHTML = json.content[i].recipe_description;

        document.getElementById("result").appendChild(a);
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
      }
    }
  });
  let clearBtn = document.getElementById("clear");
  clearBtn.addEventListener("click", () => {
    let result = document.getElementById("result");
    result.innerHTML = "";
    button.style.backgroundColor = "#f0f0f0d2";
    button.style.color = "black";
  });
});


//searching function
const searchContent = document.querySelector("#searchBar");
const searchBtn = document.querySelector("#searchSubmit");
searchBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  // console.log(searchContent.value);
  let result = document.getElementById("result");
  result.innerHTML = "";
  const res = await fetch("/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: searchContent.value }),
  });

  let json = await res.json();
  console.log(json)

  if (!json.success ||json.content.length == 0) {
    alert(`${json.message}`);
  } else if (json.success) {
    for (let i = 0; i < json.content.length; i++) {
      let a = document.createElement("a");
      a.href = "#";
      let newBlock = document.createElement("div");
      newBlock.className = "resultDisplayBlock";
      let newImageBlock = document.createElement("div");
      newImageBlock.className = "imgBlock";
      let newTextBlock = document.createElement("div");
      newTextBlock.className = "textBlock";
      let newCookingLv = document.createElement("div");
      newCookingLv.className = "cookingLv";
      newCookingLv.innerHTML = json.content[i].cooking_level.toUpperCase();
      let newImageContainer = document.createElement("div");
      newImageContainer.className = "resultImage";
      let newImage = document.createElement("img");
      newImage.src = json.content[i].image;
      let newResultHeadline = document.createElement("div");
      newResultHeadline.className = "resultHeadline";
      newResultHeadline.innerHTML = json.content[i].recipe_name;
      let newResultBriefContent = document.createElement("div");
      newResultBriefContent.className = "resultBriefContent";
      newResultBriefContent.innerHTML = json.content[i].recipe_description;

      document.getElementById("result").appendChild(a);
      a.appendChild(newBlock);
      newBlock.appendChild(newImageBlock);
      newBlock.appendChild(newTextBlock);
      newBlock.appendChild(newImageContainer);
      newImageBlock.appendChild(newImageContainer);
      newImageContainer.appendChild(newImage);
      newTextBlock.appendChild(newCookingLv);
      newTextBlock.appendChild(newResultHeadline);
      newTextBlock.appendChild(newResultBriefContent);
    }
  }
});