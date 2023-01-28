//signup
let signupForm = document.querySelector(".signUpPanel");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formData = new FormData(signupForm);
  let res = await fetch("/signup", {
    method: "POST",
    body: formData,
  });
  let res_json = await res.json();
  console.log(res_json);
  if (res_json.isSignUp) {
    location.href = "./login.html";
  } else {
    alert(`${res_json.errMess}`);
  }
  signupForm.reset();
});

let profileBtn = document.querySelector("#profileRedirect");
profileBtn.addEventListener("click",()=>{
  alert("Please sign up first!");
})