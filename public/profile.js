// const addNewPost = document.querySelector(".addpost");
// addNewPost.addEventListener("click", function () {
//   document.querySelector(".generate-post-container").classList.remove("hidden");
// });

// const cancel = document.querySelector(".cancel");
// cancel.addEventListener("click", function () {
//   document.querySelector(".generate-post-container").classList.add("hidden");
// });

async function loadPost(id) {
  const res = await fetch("/profile?id=" + id);
  const user_post = await res.json();

  if (user_post.success) {
  }
}
