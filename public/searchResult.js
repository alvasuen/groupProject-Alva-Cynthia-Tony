//
const search = document.querySelector(".search");
search.addEventListener("click", function () {
  document.querySelector(".search-header").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".search-header").classList.add("hidden");
});

//searching function
const searchContent= document.querySelector("#searchBar");
const searchBtn = document.querySelector("#searchSubmit");
searchBtn.addEventListener("click", async (event)=>{

    event.preventDefault();
    console.log(searchContent.value);

    const res = await fetch("/search", {
    method: "POST",
    body: 
});

});

