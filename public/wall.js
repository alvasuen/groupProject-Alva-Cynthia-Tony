const addNewPost = document.querySelector(".addpost");
addNewPost.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.remove("hidden");
});

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

// const postTemplate = (post) =>
//   `<div class="p2-container">
//           <div class="p2-img-container">
//             ${post.image ? `<img src="./public/uploads/${post.image}" />` : ""}
//           </div>

//           <div class="p2-right-container">
//             <div class="p2-right">
//               <div class="p2-username-date">
//                 <div class="p2-username-icon">
//                   <img class="p2-icon" src="./upload/demo.jpg" />
//                   <div class="p2-username">username</div>
//                 </div>
//                 <div class="gap"></div>
//                 <div class="p2-date">${post.create_at}</div>
//               </div>

//               <div class="p2-function">
//                 <i class="fa-regular fa-heart"></i>
//                 <i class="fa-regular fa-bookmark"></i>
//               </div>

//               <div class="p2-tag">
//                 <button>#cake</button>
//                 <button>#strawberry</button>
//                 <button>#easy</button>
//                 <button>#top10</button>
//               </div>

//               <div class="p2-content">
//                 <div>
//                   ${post.content}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div class="row"></div>`;

// async function loadPosts() {
//   const res = await fetch("/posts");
//   const posts = await res.json();
//   const postHTMLs = posts.map((post) => postTemplate(post));
//   const forum = document.querySelector("#forum");
//   forum.innerHTML = "";
//   postHTMLs.map((postHTML) => {
//     forum.innerHTML += postHTML;
//   });
// }
