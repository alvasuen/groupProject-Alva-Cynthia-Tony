const addNewPost = document.querySelector(".addpost");
addNewPost.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
});
