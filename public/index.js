// const search = document.querySelector(".search");
// search.addEventListener("click", function () {
//   document.querySelector(".search-header").classList.remove("hidden");
// });

// const cancel = document.querySelector(".cancel");
// cancel.addEventListener("click", function () {
//   document.querySelector(".search-header").classList.add("hidden");
// });

//header - profile button
let profileBtn = document.querySelector("#profileRedirect");
profileBtn.addEventListener("click", async () => {
  let res = await fetch("/currentUser");
  let json = await res.json();
  // console.log(json);
  if (json.isLogin) {
    location.href = "./profile.html";
  } else {
    location.href = "./login.html";
  }
});

window.onload = async (event) => {
  //show username and icon in header
  let res = await fetch("/currentUser");
  let json = await res.json();
  if (json.isLogin) {
    profileBtn.innerHTML = `<img src=${json.icon} style="width:30px; border-radius:50%;"> ${json.username}`;
    // profileBtn.href="./profile.html";
  } else {
    profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
  }

  //show recipes slideshow
  let recipeData = await fetch ("/popularRecipe");
  let recipeData_json = await recipeData.json();
  console.log(recipeData_json)
  if (recipeData_json.success){
    for (let i=0; i<recipeData_json.content.rowCount;i++){

      document.querySelector("#recipes").innerHTML += 
      `<a href= "http://localhost:8080/recipe.html?id=${recipeData_json.content.rows[i].recipe_id}"><div class="comment-box" >
      <div class="shadow-box">
        <div class="comment">
            <img src=${recipeData_json.content.rows[i].image}>
        </div>
        <div class="recipeTitle">
          <p>${recipeData_json.content.rows[i].recipe_name}</p>
        </div>
      </div>
    </div>
    </a>`
    }
  }
};

