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

window.onload = async (event) => {
    let res = await fetch("/currentUser");
    let json = await res.json();
    if (json.isLogin) {
      profileBtn.innerHTML = `<img src=${json.icon} style="width: 30px; height:30px; border-radius: 50%; object-fit: cover;"> ${json.username}`;
      // profileBtn.href="./profile.html";
    } else {
      profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
    }
  }

