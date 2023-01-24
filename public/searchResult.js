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
const searchForm = document.querySelector("#searchForm");
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    formData = new FormData (searchForm);
    
    let res = await fetch ("/search",{
        method: "POST",
        body: formData,
    });

    let res_json = await res.json();
    console.log(res_json);
})

