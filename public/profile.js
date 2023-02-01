// const addNewPost = document.querySelector(".addpost");
// addNewPost.addEventListener("click", function () {
//   document.querySelector(".generate-post-container").classList.remove("hidden");
// });

let profileBtn = document.querySelector("#profileRedirect");
profileBtn.addEventListener("click", async () => {
  let res = await fetch("/currentUser");
  let json = await res.json();
  console.log("JSON", json);
  if (json.isLogin) {
    location.href = "./profile.html";
  } else {
    location.href = "./login.html";
  }
});

// let imgIcon = document.querySelector(".icon");
// imgIcon.addEventListener("click", async () => {
//   let res = await fetch("/currentUser");
//   let json = await res.json();
//   console.log("JSON", json);
//   if (json.isLogin) {
//     location.href = "./profile.html";
//   } else {
//     location.href = "./login.html";
//   }
// });

//For Create new elements
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

function postStatus(status) {
  let all = document.querySelector(".main-container");
  let textContent = " ";
  // all.removeChild("textBox");
  let textBox = document.createElement("div");
  textBox.innerHTML = "";
  textBox.classList.add("textBox");
  let posts = document.querySelector(".user-posts");
  let zero = "0 Post";
  let innerText = document.createTextNode(zero);
  posts.appendChild(innerText);
  let text = document.createElement("p");
  text.classList.add("text-none");
  textContent = document.createTextNode(status);
  text.appendChild(textContent);
  textBox.appendChild(text);
  all.appendChild(textBox);
}

//It will show the user post part when the page loaded
async function onLoad() {
  try {
    gridParent.innerHTML = "";
    const res = await fetch("/postedPost");
    const allPost = await res.json();
    console.log("AllPOST: ", allPost);
    // console.log(allPost.hasOwnProperty("err"));
    if (!allPost.hasPst) {
      postStatus("Haven't posted any post.");
    }
    if (allPost.postId.length > 0) {
      for (let index = 0; index < allPost.postId.length; index++) {
        let image = allPost.image[index].image;
        let href = `http://localhost:8080/post.html?id=${allPost.postId[index].post_id}`;
        createGrid(image, href);
      }
      let posts = document.querySelector(".user-posts");
      //Show the number of total posts
      let postAmount = allPost.postId.length + " " + "Posts";
      let innerText = document.createTextNode(postAmount);
      posts.appendChild(innerText);
    }
  } catch (err) {
    console.log("Error message:" + err);
  }
}

//Read the posted post
const post = document.querySelector(".post-btn");
post.addEventListener("click", async function () {
  try {
    // gridParent.innerHTML = "";
    const res = await fetch("/postedPost");
    const allPost = await res.json();
    console.log("AllPOST: ", allPost);
    // if (!allPost.hasPst) {
    //   postStatus("Haven't posted any post.");
    // }

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
    // if (!allSavedPost.hasPst) {
    //   postStatus("Haven't saved any post.");
    // }
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

  if (json.isLogin) {
    profileBtn.innerHTML = `<img src=${json.icon} style="width:30px; border-radius:50%;"> ${json.username}`;
    // profileBtn.href="./profile.html";
  } else {
    profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
  }

  let username = document.querySelector(".username");
  let name = json.username;
  let innerName = document.createTextNode(name);
  username.appendChild(innerName);
  //ON profile page's icon
  let userIcon = document.querySelector(".icon");
  // userIcon.src = json.icon;
  let icon = await fetch ("/getUserIcon")
  let icon_json = await icon.json();
  userIcon.src = icon_json.content.rows[0].icon;

  onLoad();
};

const addNewPost = document.querySelector(".icon");
addNewPost.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
});

// file to base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

document.querySelector("#uploadFile").addEventListener("change", async () => {
  let files = document.getElementById("uploadFile").files;
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  let image = temp.join().toString();
  if (files.length > 0) {
    let img = document.createElement("img");
    img.src = image;
    img.style.height = "300px";
    let iconPreview = document.querySelector(".iconPreview");
    iconPreview.appendChild(img);
  }
});

document.querySelector("#submit").addEventListener("click", async (event) => {
  //   event.preventDefault();
  let files = document.getElementById("uploadFile").files;
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  let image = temp.join().toString();
  // console.log(image);

  const res = await fetch("/change_icon", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      icon: image,
    }),
  });

  let json = await res.json();
  if (!json.success) {
    alert(json.message);
  }
});

let logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", async (e)=>{
  let res = await fetch ("/logout");
  let res_json = res.json();
  console.log(res_json);
  location.href = "./index.html"
})
