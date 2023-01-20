const search = document.querySelector(".search");
search.addEventListener("click", function () {
  document.querySelector(".search-header").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".search-header").classList.add("hidden");
});
