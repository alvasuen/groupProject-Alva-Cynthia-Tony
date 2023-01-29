// const addNewPost = document.querySelector(".addpost");
// addNewPost.addEventListener("click", function () {
//   document.querySelector(".generate-post-container").classList.remove("hidden");
// });

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
});

const search = document.querySelector(".search");
search.addEventListener("click", function () {
  document.querySelector(".search-header").classList.remove("hidden");
});

const cancel2 = document.querySelector(".search-cancel");
cancel2.addEventListener("click", function () {
  document.querySelector(".search-header").classList.add("hidden");
});

// const profilePostTemplate = (post) => `<div class="grid">
//             <img src=${image}>
//         </div>`;

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

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let content = document.querySelector("#createPostForm");
  let textContent = content.content.value;
  let files = document.getElementById("uploadFile").files;
  // if (files.length > 0) {
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  console.log(temp1);
  let image = temp.join().toString();
  console.log(image);

  const res = await fetch("/post", {
    // send the data to browser
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      photo: image,
      text: textContent,
    }),
  });

  // response data from browser, style:(json)
  let result = await res.json();
  if (result.success) {
    // Create post
    let a = document.createElement("div");
    a.className = "grid";
    let img = document.createElement("img");
    img.src = result.post.image;
    console.log(result.post.image);
    a.appendChild(img);
    document.querySelector("#profile-post").appendChild(a);
  }
});
// let profilePost = document.querySelector(".profile-post");
// const newPostHTML = profilePostTemplate(result.post);
// profilePost.innerHTML += newPostHTML;

// const newPostHTML = profilePostTemplate(result.post.image);
// document.querySelector("#profile-post").innerHTML += newPostHTML;

// document
//   .querySelector("#createPostForm")
//   .addEventListener("submit", async function () {
//     event.preventDefault();
//     const form = event.target;
//     let formData = new FormData();
//     formData.append("content", form.content.value);
//     formData.append("photo", form.photo.files[0]);

//     const result = await res.json();
//     if (result.success) {
//       let profilePost = document.querySelector(".profile-post");
//       const newPostHTML = profilePostTemplate(result.post);
//       profilePost.innerHTML += newPostHTML;
//     }
//   });
