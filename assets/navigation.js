(function () {
  "use strict";

  function closeDropdowns(except) {
    document.querySelectorAll(".dropdown.is-open").forEach(function (dropdown) {
      if (dropdown !== except) {
        dropdown.classList.remove("is-open");
        var button = dropdown.querySelector(".dropbtn");
        if (button) button.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var menuButton = document.querySelector(".menu-toggle");
    var nav = document.getElementById("main-navigation");

    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        var opening = !nav.classList.contains("is-open");
        nav.classList.toggle("is-open", opening);
        menuButton.setAttribute("aria-expanded", String(opening));
        if (!opening) closeDropdowns();
      });
    }

    document.querySelectorAll(".dropbtn").forEach(function (button) {
      button.addEventListener("click", function (event) {
        if (window.matchMedia("(max-width: 900px)").matches) {
          event.preventDefault();
          var dropdown = button.closest(".dropdown");
          var opening = !dropdown.classList.contains("is-open");
          closeDropdowns(dropdown);
          dropdown.classList.toggle("is-open", opening);
          button.setAttribute("aria-expanded", String(opening));
        }
      });
    });

    document.addEventListener("click", function (event) {
      if (!event.target.closest("header")) {
        if (nav) nav.classList.remove("is-open");
        if (menuButton) menuButton.setAttribute("aria-expanded", "false");
        closeDropdowns();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) {
        if (nav) nav.classList.remove("is-open");
        if (menuButton) menuButton.setAttribute("aria-expanded", "false");
        closeDropdowns();
      }
    });
  });
})();
