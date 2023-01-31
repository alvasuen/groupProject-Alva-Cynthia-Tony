let showRepMode = false;

//
// const search = document.querySelector(".search");
// search.addEventListener("click", function () {
//   document.querySelector(".search-header").classList.remove("hidden");
// });

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
      //check whether saved or not
      let saveResult = await fetch ("/checkRepLike");
      let saveResult_json = await saveResult.json();
      let savedRecipes = saveResult_json.content;
      console.log({savedRecipes})

      for (let i = 0; i < json.content.recipes.rowCount; i++) {
        let likeAndResult = document.createElement("div");
        likeAndResult.className="likeAndResult";
        let a = document.createElement("a");
        a.href = `http://localhost:8080/recipe.html?id=${json.content.recipes.rows[i].recipe_id}`;
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
        let saveBtn = document.createElement("button");
        saveBtn.className="saveBtn"
        saveBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>Save`;
        saveBtn.id = json.content.recipes.rows[i].recipe_id;
        saveBtn.style.color = "black"

        document.getElementById("result").appendChild(likeAndResult);
        likeAndResult.appendChild(a)
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
        likeAndResult.appendChild(saveBtn);

        //if it has already been saved, turn the button red
        if(saveResult_json.success){
        if (savedRecipes.includes(json.content.recipes.rows[i].recipe_id)){
          saveBtn.style.color = "red"
        }}

      }

      //save a recipe - turn the button to red and update DB
      let saveBtns = document.querySelectorAll(".saveBtn");
        saveBtns.forEach((btn)=>{
          btn.addEventListener('click',async (event)=>{
          event.preventDefault();
          let id = btn.id
          if (btn.style.color == "black"){
          btn.style.color="red";
          // console.log({id})
          let result = await fetch ("/saveRecipe",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
          })
          let json = await result.json();
          // console.log(json);
          if(!json.success){
            alert(json.message)
          }
        }else if (btn.style.color == "red"){
          btn.style.color="black";
          let result2 = await fetch ("/deleteSavedRecipe",{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id:btn.id}),
          })
        }
        })
      })
      document.getElementById("result").scrollIntoView();
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
      // drawResultBox(json.content[i].recipe_id, json.content[i].cooking_level, json.content[i].image, json.content[i].recipe_name,json.content[i].recipe_description)
      let saveResult = await fetch ("/checkRepLike");
      let saveResult_json = await saveResult.json();
      let savedRecipes = saveResult_json.content;

      for (let i = 0; i < json.content.length; i++) {
        let likeAndResult = document.createElement("div");
        likeAndResult.className="likeAndResult";
        let a = document.createElement("a");
        a.href = `http://localhost:8080/recipe.html?id=${json.content[i].recipe_id}`;
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
        let saveBtn = document.createElement("button");
        saveBtn.className="saveBtn"
        saveBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>Save`;
        saveBtn.id = json.content[i].recipe_id;
        saveBtn.style.color = "black"

        document.getElementById("result").appendChild(likeAndResult);
        likeAndResult.appendChild(a)
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
        newTextBlock.appendChild(saveBtn);
        likeAndResult.appendChild(saveBtn);

        if(saveResult_json.success){
        if (savedRecipes.includes(json.content[i].recipe_id)){
          saveBtn.style.color = "red"
        }}
      }
      
      let saveBtns = document.querySelectorAll(".saveBtn");
      saveBtns.forEach((btn)=>{
        btn.addEventListener('click',async (event)=>{
          btn.addEventListener('click',async (event)=>{
            event.preventDefault();
            let id = btn.id
            if (btn.style.color == "black"){
            btn.style.color="red";
            // console.log({id})
            let result = await fetch ("/saveRecipe",{
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({id}),
            })
            let json = await result.json();
            // console.log(json);
            if(!json.success){
              alert(json.message)
            }
          }else if (btn.style.color == "red"){
            btn.style.color="black";
            let result2 = await fetch ("/deleteSavedRecipe",{
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({id}),
            })
          }
          })
      })
    })
      document.getElementById("result").scrollIntoView();
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
      let saveResult = await fetch ("/checkRepLike");
      let saveResult_json = await saveResult.json();
      let savedRecipes = saveResult_json.content;

      for (let i = 0; i < json.content.length; i++) {
        let likeAndResult = document.createElement("div");
        likeAndResult.className="likeAndResult";
        let a = document.createElement("a");
        a.href = `http://localhost:8080/recipe.html?id=${json.content[i].recipe_id}`;
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
        let saveBtn = document.createElement("button");
        saveBtn.className="saveBtn"
        saveBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>Save`;
        saveBtn.id = json.content[i].recipe_id;
        saveBtn.style.color = "black"

        document.getElementById("result").appendChild(likeAndResult);
        likeAndResult.appendChild(a)
        a.appendChild(newBlock);
        newBlock.appendChild(newImageBlock);
        newBlock.appendChild(newTextBlock);
        newBlock.appendChild(newImageContainer);
        newImageBlock.appendChild(newImageContainer);
        newImageContainer.appendChild(newImage);
        newTextBlock.appendChild(newCookingLv);
        newTextBlock.appendChild(newResultHeadline);
        newTextBlock.appendChild(newResultBriefContent);
        newTextBlock.appendChild(saveBtn);
        likeAndResult.appendChild(saveBtn);

        if(saveResult_json.success){
        if (savedRecipes.includes(json.content[i].recipe_id)){
          saveBtn.style.color = "red"
        }}
      }

      let saveBtns = document.querySelectorAll(".saveBtn");
        saveBtns.forEach((btn)=>{
          btn.addEventListener('click',async (event)=>{
          event.preventDefault();
          let id = btn.id
          if (btn.style.color == "black"){
          btn.style.color="red";
          //console.log({id})
          let result = await fetch ("/saveRecipe",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
          })
          let json = await result.json();
          // console.log(json);
          if(!json.success){
            alert(json.message)
          }
        }else if (btn.style.color == "red"){
          btn.style.color="black";
          let result2 = await fetch ("/deleteSavedRecipe",{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
          })
        }
        })
      })
      document.getElementById("result").scrollIntoView();
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
    let saveResult = await fetch ("/checkRepLike");
      let saveResult_json = await saveResult.json();
      let savedRecipes = saveResult_json.content;

    for (let i = 0; i < json.content.length; i++) {
      let likeAndResult = document.createElement("div");
      likeAndResult.className="likeAndResult";
      let a = document.createElement("a");
      a.href = `http://localhost:8080/recipe.html?id=${json.content[i].recipe_id}`;
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
      let saveBtn = document.createElement("button");
      saveBtn.className="saveBtn"
      saveBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i>Save`;
      saveBtn.id = json.content[i].recipe_id;
      saveBtn.style.color = "black"

      document.getElementById("result").appendChild(likeAndResult);
      likeAndResult.appendChild(a)
      a.appendChild(newBlock);
      newBlock.appendChild(newImageBlock);
      newBlock.appendChild(newTextBlock);
      newBlock.appendChild(newImageContainer);
      newImageBlock.appendChild(newImageContainer);
      newImageContainer.appendChild(newImage);
      newTextBlock.appendChild(newCookingLv);
      newTextBlock.appendChild(newResultHeadline);
      newTextBlock.appendChild(newResultBriefContent);
      newTextBlock.appendChild(saveBtn);
      likeAndResult.appendChild(saveBtn);

      if(saveResult_json.success){
      if (savedRecipes.includes(json.content[i].recipe_id)){
        saveBtn.style.color = "red"
      }}
    }
  }

  let saveBtns = document.querySelectorAll(".saveBtn");
        saveBtns.forEach((btn)=>{
          btn.addEventListener('click',async (event)=>{
          event.preventDefault();
          let id = btn.id
          if (btn.style.color == "black"){
          btn.style.color="red";
          console.log({id})
          let result = await fetch ("/saveRecipe",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
          })
          let json = await result.json();
          // console.log(json);
          if(!json.success){
            alert(json.message)
          }
        }else if (btn.style.color == "red"){
          btn.style.color="black";
          let result2 = await fetch ("/deleteSavedRecipe",{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id}),
          })
        }
        })
      })

  document.getElementById("result").scrollIntoView();
});


//top button
let topBtn = document.getElementById("toTheTop");

let myScrollFunc = function() {
  let y = window.scrollY;
  if (y >= 200) {
    topBtn.className = "toTheTop show"
  } else {
    topBtn.className = "toTheTop hide"
  }
};

window.addEventListener("scroll", myScrollFunc);



//header - profile button
let profileBtn = document.querySelector("#profileRedirect")
profileBtn.addEventListener('click', async ()=> {
  let res = await fetch('/currentUser');
  let json = await res.json();
  // console.log(json);
  if(json.isLogin){
    location.href = "./profile.html"
  }else{
    location.href = "./login.html"
  }
})

window.onload = async (event) =>{
  let res= await fetch ("/currentUser");
  let json = await res.json();
  if (json.isLogin){
    profileBtn.innerHTML = `<img src=${json.icon} style="width:30px; border-radius:50%;"> ${json.username}`;
    // profileBtn.href="./profile.html";
  }else{
    profileBtn.innerHTML=`<i class="fa-solid fa-user"></i>`
  }
}

