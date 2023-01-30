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

let forum = document.querySelector(".forum");
forum.addEventListener("click", async () => {
  let res = await fetch("/currentUser");
  let json = await res.json();
  if (json.isLogin) {
    location.href = "./forum.html";
  }
});

window.onload = async (event) => {
  let res = await fetch("/currentUser");
  let json = await res.json();
  if (json.isLogin) {
    profileBtn.innerHTML = `<img src=${json.icon} style="width:30px; border-radius:50%;"> ${json.username}`;
    // profileBtn.href="./profile.html";
  } else {
    profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
  }
};
