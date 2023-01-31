// const addNewPost = document.querySelector(".addpost");
// addNewPost.addEventListener("click", function () {
//   document.querySelector(".generate-post-container").classList.remove("hidden");
// });

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

const gridParent = document.querySelector("#profile-post");

const createPost = document.querySelector(".addpost");
// createPost.addEventListener("click", async function () {
// const res = await fetch("/post");
// const result = await res.json();
// const b = document.createElement("a");
// b.href = `http://localhost:8080/forum.html`;
// createPost.appendChild(b);
// });

//For create new grid
function createGrid(image, href) {
  let grid = document.createElement("div");
  grid.classList.add("grid");
  let img = document.createElement("img");
  img.classList.add("image");
  img.src = image;
  let a = document.createElement("a");
  a.href = href;
  a.appendChild(img);
  grid.appendChild(a);
  gridParent.appendChild(grid);
}

//It will show the user post part when the page loaded
async function onLoad() {
  try {
    gridParent.innerHTML = "";
    const res = await fetch("/postedPost");
    const allPost = await res.json();
    console.log("AllPOST: ", allPost);

    for (let index = 0; index < allPost.postId.length; index++) {
      let image = allPost.image[index].image;
      let href = `http://localhost:8080/post.html?id=${allPost.postId[index].post_id}`;
      createGrid(image, href);
      // console.log("index", index);
    }
    let posts = document.querySelector(".user-posts");
    let postAmount = allPost.postId.length + " " + "Posts";
    let innerText = document.createTextNode(postAmount);
    posts.appendChild(innerText);
  } catch (err) {
    console.log("Error message:" + err);
  }
}

//Read the posted post
const post = document.querySelector(".post-btn");
post.addEventListener("click", async function () {
  try {
    gridParent.innerHTML = "";
    const res = await fetch("/postedPost");
    const allPost = await res.json();
    console.log("AllPOST: ", allPost);

    for (let index = 0; index < allPost.postId.length; index++) {
      let image = allPost.image[index].image;
      let href = `http://localhost:8080/post.html?id=${allPost.postId[index].post_id}`;
      createGrid(image, href);
      // console.log("index", index);
    }
  } catch (err) {
    console.log("Error message:" + err);
  }
});

//Read the saved recipes
const recipe = document.querySelector(".recipe-btn");
recipe.addEventListener("click", async function () {
  try {
    gridParent.innerHTML = "";
    const res = await fetch("/saveRecipe");
    const resImages = await res.json();
    console.log("resImg:", resImages);
    // console.log("Front:" + resImages);
    for (let index = 0; index < resImages.saveRecipeArray.length; index++) {
      let image = resImages.saveRecipeArray[index].image;
      let href = `http://localhost:8080/recipe.html?id=${resImages.saveRecipesId[index].recipe_id}`;
      createGrid(image, href);
    }
  } catch (err) {
    console.log("Error message: ", err);
  }
});

//Read the saved posts
const saved = document.querySelector(".saved-btn");
saved.addEventListener("click", async function () {
  try {
    gridParent.innerHTML = "";
    const res = await fetch("/savedPosts");
    const allSavedPost = await res.json();
    console.log(allSavedPost);
    for (let index = 0; index < allSavedPost.allSavedPost.length; index++) {
      let image = allSavedPost.allSavedPostImage[index].image;
      let href = `http://localhost:8080/post.html?id=${allSavedPost.allSavedPost[index].post_id}`;
      createGrid(image, href);
    }
  } catch (err) {
    console.log("Error message: ", err);
  }
});

window.onload = async (e) => {
  let res = await fetch("/currentUser");
  let json = await res.json();
  let username = document.querySelector(".username");
  let name = json.username;
  let innerName = document.createTextNode(name);
  username.appendChild(innerName);
  if (json.isLogin) {
    profileBtn.innerHTML = `<img src=${json.icon} style="width:30px; border-radius:50%;"> ${json.username}`;
    // profileBtn.href="./profile.html";
  } else {
    profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
  }
  onLoad();
};
