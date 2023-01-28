//Login
let loginForm = document.querySelector(".loginPanel");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formData = new FormData(loginForm);
  //send request to server
  let res = await fetch("/login", {
    method: "POST",
    body: formData,
  });
  let res_json = await res.json();
  console.log(res_json);
  if (res_json.isLogin) {
  location.href = "./index.html";
  } else {
    alert(`${res_json.errMess}`);
  }
  loginForm.reset();
});

let profileBtn = document.querySelector("#profileRedirect");
profileBtn.addEventListener("click",()=>{
  alert("Please login!");
})