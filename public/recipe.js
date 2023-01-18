// Total pages
const PAGECOUNT = 12;

// Current page number
let pageNo = 0;

//Content page
let pages = document.querySelectorAll(".book-page");

//Cover page
let cover = document.querySelectorAll(".book-cover");

// button
// let btn = document.querySelectorAll("#control button");
let btn = document.querySelectorAll(".c-btn");
let book = document.querySelector("#book");
let allPage = document.querySelectorAll(".one-page");

function init() {
  //init content page's photos
  for (let index = 0; index < pages.length; index++) {
    pages[index].style.backgroundImage = "url('" + [index + 1] + ".jpg')";
    pages[index].style.zIndex = PAGECOUNT - index - 1;
  }

  cover[0].style.zIndex = PAGECOUNT;
  cover[1].style.zIndex = 1;

  //Default page is cover page, left button is invalid
  btn[0].style.backgroundColor = "rgb(110,110,110,0.5)";
  btn[0].style.color = "darkgray";
  btn[0].disabled = true;

  //left page
  btn[0].onclick = function () {
    pageNo--;
    //if is last page return
    if (PAGECOUNT - 1 == pageNo) {
      allPage[pageNo].style.transform = "rotateY(0deg)";
      //(240px + 50px) * 5
      book.style.transform = "translateX(145px)";
      btn[1].style.backgroundColor = "rgb(63,63,63,0.8)";
      btn[1].style.color = "darkgray";
      btn[1].disabled = false;
    } else {
      allPage[pageNo].style.transform = "rotateY(0deg)";
    }
    allPage[pageNo].style.zIndex = PAGECOUNT - pageNo;

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
      allPage[pageNo].style.transform = "rotateY(-180deg)";
      //(240px + 50px) * 5
      book.style.transform = "translateX(145px)";
      btn[0].style.backgroundColor = "rgb(63,63,63,0.8)";
      btn[0].style.color = "white";
      btn[0].disabled = false;
    } else {
      allPage[pageNo].style.transform = "rotateY(-180deg)";
    }
    allPage[pageNo].style.zIndex = 1000 + pageNo;
    pageNo++;

    if (PAGECOUNT == pageNo) {
      btn[1].style.backgroundColor = "rgb(110,110,110,0.5)";
      btn[1].style.color = "darkgray";
      btn[1].disabled = true;
      book.style.transform = "translateX(300px)";
    }
  };
}
init();
