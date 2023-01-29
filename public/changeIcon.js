//change to select the original profile picture
const addNewPost = document.querySelector(".pretendToBeTheOriginalIcon");
addNewPost.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
});

// file to base64
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      let encoded = reader.result.toString().replace(/^data:(.*,)?/, "");
      if (encoded.length % 4 > 0) {
        encoded += "=".repeat(4 - (encoded.length % 4));
      }
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
}

document.querySelector("#uploadFile").addEventListener("change", async () => {
  let files = document.getElementById("uploadFile").files;
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  let image = temp.join().toString();
  if (files.length > 0) {
    let img = document.createElement("img");
    img.src = image;
    img.style.height = "300px";
    let iconPreview = document.querySelector(".iconPreview");
    iconPreview.appendChild(img);
  }
});

document.querySelector("#submit").addEventListener("click", async (event) => {
//   event.preventDefault();
  let files = document.getElementById("uploadFile").files;
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  let image = temp.join().toString();
  console.log(image);

  const res = await fetch("/profile/change_icon", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      icon: image,
    }),
  });

  let json = await res.json();
  if(!json.success){
    alert(json.message)
  }
});
