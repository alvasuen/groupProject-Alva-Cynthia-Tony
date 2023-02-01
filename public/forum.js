const cancel = document.querySelector(".cancel");
const filter = document.querySelector(".filter");
cancel.addEventListener("click", function () {
  document.querySelector(".generate-post-container").classList.add("hidden");
  filter.classList.add("hidden");
});

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

// search tag function
// const searchTag = document.querySelector(".search-tag");
// const searchTagForm = document.querySelector(".searchTagForm ");
// searchTag.addEventListener("click", function () {
//   if (searchTagForm.classList.contains("hidden")) {
//     searchTagForm.classList.remove("hidden");
//   } else {
//     searchTagForm.classList.add("hidden");
//   }
// });

let i = 1;
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

async function likePost() {
  3;
  let res = await fetch("/currentUser");
  let json = await res.json();
  if (json.isLogin) {
    let like = document.querySelectorAll(".fa-heart");

    for (let i = 0; i < like.length; i++) {
      like[i].addEventListener("click", async (e) => {
        e.preventDefault();
        let id = like[i].classList[2].slice(6);
        console.log(id);
        let liked = like[i].classList.value;
        console.log(liked, 456);
        let result = liked.includes("liked");
        if (result) {
          like[i].classList.remove("liked");
        } else {
          like[i].classList.add("liked");
        }
        console.log(result);
        const res = await fetch("/post/likePost/:id", {
          // send the data to browser
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id,
            liked: result,
          }),
        });
        const json = await res.json();
        if (json.success) {
          console.log(json);
          // if (like[i].classList.contains("liked")) {
          //   like[i].classList.remove("liked");
          // } else {
          //   like[i].classList.add("liked");
          // }
          let likedCount = document.querySelector("span");
          console.log(likedCount.classList);
          likedCount.innerHTML = "";
          let innerText = document.createTextNode(
            json.likedCount[0].liked_count
          );
          likedCount.appendChild(innerText);
          console.log(json.likedCount[0].liked_count);
        }
      });
    }
  }
}

async function savePost() {
  let res = await fetch("/currentUser");
  let json = await res.json();
  if (json.isLogin) {
    let bookmark = document.querySelectorAll(".fa-bookmark");
    for (let i = 0; i < bookmark.length; i++) {
      bookmark[i].addEventListener("click", async (e) => {
        e.preventDefault();
        let id = bookmark[i].classList[2].slice(9);
        let bookmarked = bookmark[i].classList.value;
        let result = bookmarked.includes("saved");
        console.log(result);
        const res = await fetch("/post/savePost/:id", {
          // send the data to browser
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: id,
            saved: result,
          }),
        });
        const json = await res.json();
        if (json.success) {
          if (bookmark[i].classList.contains("saved")) {
            bookmark[i].classList.remove("saved");
          } else {
            bookmark[i].classList.add("saved");
          }
          // location.href = "./forum.html";
        }
      });
    }
  }
}

window.onload = async () => {
  await loadPosts();

  let res = await fetch("/currentUser");
  let json = await res.json();
  let addPostBtn = document.querySelector(".add-post-container");
  if (json.isLogin) {
    profileBtn.innerHTML = `<img src=${json.icon} style="width: 30px; height:30px; border-radius: 50%; object-fit: cover;"> ${json.username}`;
    profileBtn.href = "./profile.html";
    addPostBtn.innerHTML = `<button class="addpost"><i class="fa-solid fa-plus"></i></button>`;
  } else {
    profileBtn.innerHTML = `<i class="fa-solid fa-user"></i>`;
    addPostBtn.innerHTML = "";
  }

  const addNewPost = document.querySelector(".addpost");
  addNewPost.addEventListener("click", function () {
    document
      .querySelector(".generate-post-container")
      .classList.remove("hidden");
    filter.classList.remove("hidden");
  });

  likePost();

  savePost();
};

async function loadPosts() {
  try {
    const res = await fetch("/posts");
    const json = await res.json();
    console.log(json);

    if (json.success) {
      let forum = document.querySelector(".main");
      forum.innerHTML = "";
      console.log(json);

      for (let i = json.posts.length - 1; i >= 0; i--) {
        // for (let i = 0; i < json.post.posts.length; i++) {
        // forum += createPost(json.post[i]);
        let p2Container = document.createElement("div");
        p2Container.className = "p2-container";
        let p2ImgContainer = document.createElement("div");
        p2ImgContainer.className = "p2-img-container";
        let img = document.createElement("img");
        img.src = json.posts[i].image;

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
        p2Icon.src = json.posts[i].icon;

        let p2Username = document.createElement("div");
        p2Username.className = "p2-username";
        p2Username.innerHTML = json.posts[i].username;

        let gap = document.createElement("div");
        gap.className = "gap";
        let p2Date = document.createElement("div");
        p2Date.className = "p2-date";
        p2Date.innerHTML = json.posts[i].created_at.slice(0, 10);

        let p2Function = document.createElement("div");
        p2Function.className = "p2-function";

        let likeContainer = document.createElement("div");
        likeContainer.className = "like-container";

        let faHeart = document.createElement("i");
        faHeart.className = `fa-solid fa-heart heart-${json.posts[i].post_id}`;

        for (let j = 0; j < json.checkLiked.length; j++) {
          if (
            json.posts[i].post_id == json.checkLiked[j].post_id &&
            json.checkLiked[j].liked == true
          ) {
            faHeart.className = `fa-solid fa-heart heart-${json.posts[i].post_id} liked`;
          }
        }

        let likedCount = document.createElement("span");
        likedCount.className = `likedCount likeCount-${json.posts[i].post_id}`;
        likedCount.textContent = json.posts[i].liked_count;
        // likedCount.style.fontFamily = "Courier New, Courier, monospace";

        let faBookMark = document.createElement("i");
        faBookMark.className = `fa-solid fa-bookmark bookmark-${json.posts[i].post_id}`;
        for (let j = 0; j < json.checkSaved.length; j++) {
          if (
            json.posts[i].post_id == json.checkSaved[j].post_id &&
            json.checkSaved[j].saved == true
          ) {
            faBookMark.className = `fa-solid fa-bookmark bookmark-${json.posts[i].post_id} saved`;
          }
        }

        let p2TagContainer = document.createElement("div");
        p2TagContainer.className = "p2-tag-container";

        // generate tags
        let dbTag = Object.values(json.tags);
        for (let j = 0; j < dbTag.length; j++) {
          if (json.posts[i].post_id == json.tags[j].post_id) {
            let obj = json.tags[j].tag_content;
            let p2Tag = document.createElement("button");
            p2Tag.className = "p2-tag";
            p2Tag.innerHTML = obj;
            p2TagContainer.appendChild(p2Tag);
          }
        }

        let p2Content = document.createElement("div");
        p2Content.className = "p2-content";
        let p2ContentContent = document.createElement("div");
        p2ContentContent.className = "p2-content-content";
        p2ContentContent.innerHTML = json.posts[i].content;

        let row = document.createElement("div");
        row.className = "row";

        forum.appendChild(p2Container);
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

        p2Function.appendChild(likeContainer);
        likeContainer.appendChild(faHeart);
        likeContainer.appendChild(likedCount);
        p2Function.appendChild(faBookMark);
        p2Right.appendChild(p2TagContainer);
        // p2TagContainer.appendChild(p2Tag); forum.js:92
        p2Right.appendChild(p2Content);
        p2Content.appendChild(p2ContentContent);
        forum.appendChild(row);
      }

      let tagButtons = document.querySelectorAll(".p2-tag");
      tagButtons.forEach((btn) => {
        btn.addEventListener("click", async () => {
          document.querySelector(".main").innerHTML = "";
          let res = await fetch("/getTagPosts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: btn.textContent }),
          });

          let tagButtons_res = await res.json();
          console.log(tagButtons_res);

          if (json.success) {
            for (let i = 0; i < tagButtons_res.content.rowCount; i++) {
              console.log(tagButtons_res.content.rows[i].content);
              let p2Container = document.createElement("div");
              p2Container.className = "p2-container";
              let p2ImgContainer = document.createElement("div");
              p2ImgContainer.className = "p2-img-container";
              let img = document.createElement("img");
              img.src = tagButtons_res.content.rows[i].image;

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
              p2Icon.src = tagButtons_res.userData.rows[0].icon; // now only for one user_id

              let p2Username = document.createElement("div");
              p2Username.className = "p2-username";
              p2Username.innerHTML = tagButtons_res.userData.rows[0].username;

              let gap = document.createElement("div");
              gap.className = "gap";
              let p2Date = document.createElement("div");
              p2Date.className = "p2-date";
              p2Date.innerHTML = tagButtons_res.content.rows[
                i
              ].created_at.slice(0, 10);

              let p2Function = document.createElement("div");
              p2Function.className = "p2-function";

              let likeContainer = document.createElement("div");
              likeContainer.className = "like-container";

              let faHeart = document.createElement("i");
              faHeart.className = `fa-solid fa-heart heart-${tagButtons_res.content.rows[0].post_id}`;
              for (let j = 0; j < tagButtons_res.checkLiked.rows.length; j++) {
                if (
                  tagButtons_res.content.rows[i].post_id ==
                    tagButtons_res.checkLiked.rows[j].post_id &&
                  tagButtons_res.checkLiked.liked == true
                ) {
                  faHeart.className = `fa-solid fa-heart heart-${tagButtons_res.content.rows[0].post_id} liked`;
                }
              }

              let likedCount = document.createElement("span");
              likedCount.className = `likedCount likeCount-${tagButtons_res.content.rows[0].post_id}`;
              likedCount.textContent =
                tagButtons_res.content.rows[0].liked_count;
              // likedCount.style.fontFamily = "Courier New, Courier, monospace";

              let faBookMark = document.createElement("i");
              faBookMark.className = `fa-solid fa-bookmark bookmark-${tagButtons_res.content.rows[0].post_id}`;
              for (let j = 0; j < tagButtons_res.checkSaved.length; j++) {
                if (
                  tagButtons_res.content.rows[i].post_id ==
                    tagButtons_res.checkSaved.rows[j].post_id &&
                  tagButtons_res.checkSaved[j].saved == true
                ) {
                  faBookMark.className = `fa-solid fa-bookmark bookmark-${tagButtons_res.content.rows[0].post_id} saved`;
                }
              }

              let p2TagContainer = document.createElement("div");
              p2TagContainer.className = "p2-tag-container";

              // generate tags
              // let dbTag = Object.values(tagButtons_res.tags.rowCount);
              // for (let j = 0; j < dbTag; j++) {
              //   if (
              //     tagButtons_res.content.rows[i].post_id ==
              //     tagButtons_res.tags.rows[j].post_id
              //   ) {
              //     let obj = tagButtons_res.tags.rows[j].tag_content;
              //     let p2Tag = document.createElement("button");
              //     p2Tag.className = "p2-tag";
              //     p2Tag.innerHTML = obj;
              //     p2TagContainer.appendChild(p2Tag);
              //   }
              // }

              let p2Content = document.createElement("div");
              p2Content.className = "p2-content";
              let p2ContentContent = document.createElement("div");
              p2ContentContent.className = "p2-content-content";
              p2ContentContent.innerHTML =
                tagButtons_res.content.rows[i].content;

              let row = document.createElement("div");
              row.className = "row";

              forum.appendChild(p2Container);
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

              p2Function.appendChild(likeContainer);
              likeContainer.appendChild(faHeart);
              likeContainer.appendChild(likedCount);
              p2Function.appendChild(faBookMark);
              p2Right.appendChild(p2TagContainer);
              // p2TagContainer.appendChild(p2Tag); forum.js:92
              p2Right.appendChild(p2Content);
              p2Content.appendChild(p2ContentContent);
              forum.appendChild(row);
            }
          }
        });
      });
    }
  } catch (err) {
    console.log("Error message", err);
  }
}

// create post
document.querySelector("#submit").addEventListener("click", async (event) => {
  event.preventDefault();
  let content = document.querySelector("#createPostForm");
  let textContent = content.content.value;

  let files = document.getElementById("uploadFile").files;
  // if (files.length > 0) {
  let temp1 = await getBase64(files[0]);
  let temp = ["data:image/jpeg;base64", temp1.toString()];
  let image = temp.join().toString();

  let obj = {};
  let tags = document.querySelectorAll(".tag-name");
  for (let tag of tags) {
    obj = Object.assign(obj, { [`${tag.id}`]: tag.textContent });
  }

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
  console.log(result.post.createdPost.rows[0].content);
  if (result.success) {
    let p2Container = document.createElement("div");
    p2Container.className = "p2-container";
    let p2ImgContainer = document.createElement("div");
    p2ImgContainer.className = "p2-img-container";
    let img = document.createElement("img");
    img.src = result.post.createdPost.rows[0].image;

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
    p2Date.innerHTML = result.post.createdPost.rows[0].created_at.slice(0, 10);

    let p2Function = document.createElement("div");
    p2Function.className = "p2-function";

    let likeContainer = document.createElement("div");
    likeContainer.className = "like-container";

    let faHeart = document.createElement("i");
    faHeart.className = `fa-solid fa-heart}`;

    let likedCount = document.createElement("span");
    likedCount.className = `likedCount`;
    likedCount.textContent = result.post.createdPost.rows[0].liked_count;

    let faBookMark = document.createElement("i");
    faBookMark.className = `fa-solid fa-bookmark`;
    // faBookMark.textContent = result.post.username.rows[0].saved_count;

    let p2TagContainer = document.createElement("div");
    p2TagContainer.className = "p2-tag-container";

    let obj = Object.values(result.post.tags);

    for (let i = 0; i < obj.length; i++) {
      let p2Tag = document.createElement("button");
      p2Tag.className = "p2-tag";
      p2Tag.innerHTML = obj[i];
      p2TagContainer.appendChild(p2Tag);
      // console.log(obj[i]);
    }

    let p2Content = document.createElement("div");
    p2Content.className = "p2-content";
    let p2ContentContent = document.createElement("div");
    p2ContentContent.className = "p2-content-content";
    p2ContentContent.innerHTML = result.post.createdPost.rows[0].content;

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
    p2Function.appendChild(likeContainer);
    likeContainer.appendChild(faHeart);
    likeContainer.appendChild(likedCount);
    p2Function.appendChild(faBookMark);
    p2Right.appendChild(p2TagContainer);
    // p2TagContainer.appendChild(p2Tag); // wrote in above
    p2Right.appendChild(p2Content);
    p2Content.appendChild(p2ContentContent);
    document.querySelector(".main").appendChild(row);

    location.href = "./forum.html";
  }
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
