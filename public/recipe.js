// Total pages, default value is 12
//這裡可以設置成步驟的總數
// let totalPage;

// // Current page number
// let pageNo = 0;

// //Content page
// //TODO create elements of .book-page
// // let pages = document.querySelectorAll(".book-page");

// //Cover page
// let cover = document.querySelectorAll(".book-cover");

// // Button
// // let btn = document.querySelectorAll("#control button");
let book = document.querySelector("#book");
// let btn = document.querySelectorAll(".c-btn");
// let allPage = document.querySelectorAll(".one-page");

//TODO remove the elements
async function removePage() {
  let pageEl = document.querySelectorAll(".book-page");
  for (let index = 0; index < pageEl.length; index++) {
    book.removeChild(pageEl[index]);
  }
}

//TODO the home page of recipe steps
async function loadInit(id) {
  await removePage();
  //http://localhost:8080/recipes/steps?id=3
  const res = await fetch("/recipe?id=" + id);
  // console.log("res: " + res);
  const steps = await res.json();

  if (steps.success) {
    console.log("steps: " + steps);
    totalPage = steps.steps_number.length;
    console.log("pages: " + totalPage);

    for (let index = 0; index < totalPage; index++) {
      //Create new elements for STEPs
      // let mySteps = document.querySelector("#book");
      let refNode = document.querySelector(".last-cover");
      let bookPage = document.createElement("div");
      bookPage.classList.add("book-page");
      bookPage.classList.add("one-page");
      let pageBackground = document.createElement("div");
      pageBackground.classList.add("page-background");
      let innerPBImg = document.createElement("div");
      innerPBImg.classList.add("img-box");
      let img = document.createElement("img");
      img.classList.add("step-1");
      let innerPBText = document.createElement("div");
      innerPBText.classList.add("text-box");
      console.log("INDEX: " + index);
      let textContent = steps.step_description[index].step_description;
      let innerPBTContent = document.createTextNode(
        steps.step_description[index].step_description
      );
      // let newC = textContent.split(",");
      // console.log(newC);
      //將img element put 入 innerPBImg 這個div
      innerPBImg.appendChild(img);
      //將 p element put 入 innerPBText 這個div
      innerPBText.appendChild(innerPBTContent);
      //將innerPBImg 及 innerPBText 的div，put入pageBackground 的div
      pageBackground.appendChild(innerPBImg);
      pageBackground.appendChild(innerPBText);
      //將pageBackground 的div put 入 bookPage
      bookPage.appendChild(pageBackground);
      //將新的node 插入 refNode 前面
      book.insertBefore(bookPage, refNode);
      console.log("TIMES:" + index);
      if (steps.image.length > 0) {
        //Add the path of image into the img element
        img.src = `${steps.image[index].image}`;
      } else {
        img.src = "/upload/recipe-cover.avif";
      }
      // pages[index].style.backgroundImage = "url('" + [index + 1] + ".jpg')";
    }

    let pageNo = 0;

    //Content page
    //TODO create elements of .book-page
    // let pages = document.querySelectorAll(".book-page");

    //Cover page
    let cover = document.querySelectorAll(".book-cover");

    // Button
    // let btn = document.querySelectorAll("#control button");
    let btn = document.querySelectorAll(".c-btn");
    let allPage = document.querySelectorAll(".one-page");
    let pages = document.querySelectorAll(".book-page");
    console.log("P:" + pages.length);
    //這一步是讓後一頁，覆蓋前一頁
    for (let index = 0; index < pages.length; index++) {
      // pages[index].style.zIndex = totalPage - index - 1;
      // let url = `"${steps.image[index].image}"`;
      // pages[index].style.backgroundImage = url;
      // pages[index].style.src = `${steps.image[index].image}`;
      pages[index].style.zIndex = totalPage - index - 1;
    }

    //封面的圖層級數
    cover[0].style.zIndex = totalPage;
    //封底的圖層級數
    cover[1].style.zIndex = 1;

    //Default page is cover page, left button is invalid
    //btn[0] 是左邊的button
    btn[0].style.backgroundColor = "rgb(110,110,110,0.5)";
    btn[0].style.color = "darkgray";
    btn[0].disabled = true;

    //left page
    //當點擊左邊button
    btn[0].onclick = function () {
      //往後退一頁
      pageNo--;
      console.log("PageNo:" + pageNo);
      //if the last page return
      if (totalPage - 1 == pageNo) {
        allPage[pageNo].style.transform = "rotateY(0deg)";

        //(240px + 50px) * 5
        book.style.transform = "translateX(145px)";
        btn[1].style.backgroundColor = "rgb(63,63,63,0.8)";
        btn[1].style.color = "darkgray";
        btn[1].disabled = false;
        // btn[1].disabled = true;
      } else {
        allPage[pageNo].style.transform = "rotateY(0deg)";
      }
      allPage[pageNo].style.zIndex = totalPage - pageNo;

      if (0 == pageNo) {
        btn[0].style.backgroundColor = "rgb(110,110,110,0.5)";
        btn[0].style.color = "darkgray";
        btn[0].disabled = true;
        book.style.transform = "translateX(0px)";
      }
    };

    //Right page
    btn[1].onclick = function () {
      //if this is first page, turn front
      if (0 == pageNo) {
        // 水平反轉180度
        allPage[pageNo].style.transform = "rotateY(-180deg)";

        //當打開書，就水平向左移145px
        book.style.transform = "translateX(145px)";
        btn[0].style.backgroundColor = "rgb(63,63,63,0.8)";
        btn[0].style.color = "white";
        btn[0].disabled = false;
      } else {
        allPage[pageNo].style.transform = "rotateY(-180deg)";
      }
      allPage[pageNo].style.zIndex = 1000 + pageNo;
      pageNo++;

      if (totalPage == pageNo) {
        btn[1].style.backgroundColor = "rgb(110,110,110,0.5)";
        btn[1].style.color = "darkgray";
        btn[1].disabled = true;
        // btn[1].disabled = false;
        // book.style.transform = "translateX(300px)";
      }
    };
  }
}

window.onload = async function () {
  let params = new URL(document.location).searchParams;
  let id = params.get("id");
  await loadInit(id);
};
