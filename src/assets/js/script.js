const burger = document.querySelector(".top-nav__burger");
const menus = document.querySelector(".top-nav__menu-area");

burger.addEventListener("click", function (event) {
  menus.classList.toggle("nav-active");
  burger.classList.toggle("burger-toggle");
});
