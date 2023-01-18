//signup
let signupForm = document.querySelector(".signUpPanel");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formData = new FormData(signupForm);
  //send request to server
  let res = await fetch("/signup", {
    method: "POST",
    body: formData,
  });
  let res_json = await res.json();
  console.log(res_json);
  if ({success : true}) {
    location.href = "./login.html";
  } else {
    alert(`Attempt fail!`);
  }
  signupForm.reset();
});