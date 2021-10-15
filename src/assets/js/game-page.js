const burgerGame = document.querySelector(".game-top-nav__burger");
const menusGame = document.querySelector(".game-top-nav__menu-area");

burgerGame.addEventListener("click", function (event) {
  menusGame.classList.toggle("nav-active");
  burgerGame.classList.toggle("burger-toggle");
});