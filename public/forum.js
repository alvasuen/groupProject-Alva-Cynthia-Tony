const addNewPost = document.querySelector(".addpost");
addNewPost.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.remove("hidden");
});

const cancel = document.querySelector(".cancel");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
});

let i = 1;
// let tempArr = [];
const createTag = document.querySelector(".tag-submit");
const tags = createTag.addEventListener("click", function (event) {
  event.preventDefault();
  let button = document.createElement("button");
  button.className = "tag-name";
  button.innerHTML = document.querySelector(".tag-content").value;
  button.id = i;
  document.querySelector(".created-tag").appendChild(button);
  document.querySelector(".tag-content").value = "";
  i++;
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

const postTemplate = (post) => {
  `<div class="p2-container">
          <div class="p2-img-container">
            <img src="${post.image}" />
          </div>

          <div class="p2-right-container">
            <div class="p2-right">
              <div class="p2-username-date">
                <div class="p2-username-icon">
                  <img class="p2-icon" src="${post.icon.rows[0].icon}" />
                  <div class="p2-username">${post.username.rows[0].username}</div>
                </div>
                <div class="gap"></div>
                <div class="p2-date">${post.createdDate.rows[0].created_at}</div>
              </div>

              <div class="p2-function">
                <i class="fa-regular fa-heart"></i>
                <i class="fa-regular fa-bookmark"></i>
              </div>

              <div class="p2-tag-container">
                <button class="p2-tag">#cake</button>
                <button class="p2-tag">#strawberry</button>
                <button class="p2-tag">#easy</button>
                <button class="p2-tag">#top10</button>
              </div>

              <div class="p2-content">
                <div>
                  ${post.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row"></div>`;
};

document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let content = document.querySelector("#createPostForm");
  let textContent = content.content.value;

  let files = document.getElementById("uploadFile").files;
  // if (files.length > 0) {
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  console.log(temp1);
  let image = temp.join().toString();
  console.log(image);

  let obj = {};
  let tags = document.querySelectorAll(".tag-name");
  for (let tag of tags) {
    obj = Object.assign(obj, { [`${tag.id}`]: tag.textContent });
  }
  console.log(obj);

  const res = await fetch("/post", {
    // send the data to browser
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      photo: image,
      text: textContent,
      tags: obj,
    }),
  });

  //   response data from browser, style:(json)
  const result = await res.json();
  if (result.success) {
    //create post
    let p2Container = document.createElement("div");
    p2Container.className = "p2-container";
    let p2ImgContainer = document.createElement("div");
    p2ImgContainer.className = "p2-img-container";
    let img = document.createElement("img");
    img.src = result.post.image;

    let p2RightContainer = document.createElement("div");
    p2RightContainer.className = "p2-right-container";
    let p2Right = document.createElement("div");
    p2Right.className = "p2-right";
    let p2UsernameDate = document.createElement("div");
    p2UsernameDate.className = "p2-username-date";
    let p2UsernameIcon = document.createElement("div");
    p2UsernameIcon.className = "p2-username-icon";
    let p2Icon = document.createElement("img");
    p2Icon.className = "p2-icon";
    p2Icon.src = result.post.icon.rows[0].icon;

    let p2Username = document.createElement("div");
    p2Username.className = "p2-username";
    p2Username.innerHTML = result.post.username.rows[0].username;

    let gap = document.createElement("div");
    gap.className = "gap";
    let p2Date = document.createElement("div");
    p2Date.className = "p2-date";
    p2Date.innerHTML = result.post.createdDate.rows[0].created_at.slice(0, 10);

    let p2Function = document.createElement("div");
    p2Function.className = "p2-function";


    let faHeart = document.createElement("i");
    faHeart.className = "fa-regular fa-heart";


    let faBookMark = document.createElement("i");
    faBookMark.className = "fa-regular fa-bookmark";

    let p2TagContainer = document.createElement("div");
    p2TagContainer.className = "p2-tag-container";

    let obj = Object.values(result.post.tags);
    console.log(obj);
    for (let i = 0; i < obj.length; i++) {
      let p2Tag = document.createElement("button");
      p2Tag.className = "p2-tag";
      p2Tag.innerHTML = obj[i];
      p2TagContainer.appendChild(p2Tag);
      console.log(obj[i]);
      //   console.log(p2Tag.innerHTML + "123");
    }
    // let p2Tag = document.createElement("button");
    // p2Tag.className = "p2-tag";
    // p2Tag.innerHTML = "cake";

    let p2Content = document.createElement("div");
    p2Content.className = "p2-content";
    let p2ContentContent = document.createElement("div");
    p2ContentContent.className = "p2-content-content";
    p2ContentContent.innerHTML = result.post.content;

    let row = document.createElement("div");
    row.className = "row";

    document.querySelector(".main").appendChild(p2Container);
    p2Container.appendChild(p2ImgContainer);
    p2ImgContainer.appendChild(img);

    p2Container.appendChild(p2RightContainer);
    p2RightContainer.appendChild(p2Right);
    p2Right.appendChild(p2UsernameDate);
    p2UsernameDate.appendChild(p2UsernameIcon);
    p2UsernameIcon.appendChild(p2Icon);
    p2UsernameIcon.appendChild(p2Username);
    p2UsernameDate.appendChild(gap);
    p2UsernameDate.appendChild(p2Date);
    p2Right.appendChild(p2Function);
    p2Function.appendChild(faHeart);
    p2Function.appendChild(faBookMark);
    p2Right.appendChild(p2TagContainer);
    // p2TagContainer.appendChild(p2Tag);
    p2Right.appendChild(p2Content);
    p2Content.appendChild(p2ContentContent);
    document.querySelector(".main").appendChild(row);
  }
});

// let forum = document.querySelector(".main");
// const newPostHTML = postTemplate(result.post);
// forum.innerHTML += newPostHTML;

//   let result = await res.json();
//   if (result.success) {
//     // Create post
//     let a = document.createElement("div");
//     a.className = "grid";
//     let img = document.createElement("img");
//     img.src = result.post.image;
//     console.log(result.post.image);
//     a.appendChild(img);
//     document.querySelector("#profile-post").appendChild(a);
//   }
