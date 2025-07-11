// Script para manejar el menú desplegable del avatar
document.addEventListener("DOMContentLoaded", function() {
  const avatarBtn = document.getElementById("avatarBtn");
  const dropdownArrow = document.getElementById("dropdownArrow");
  const dropdownMenu = document.getElementById("dropdownMenu");

  if (avatarBtn && dropdownMenu && dropdownArrow) {
    function toggleMenu(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle("show");
    }
    avatarBtn.addEventListener("click", toggleMenu);
    dropdownArrow.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
      if (!avatarBtn.contains(event.target) && !dropdownMenu.contains(event.target) && !dropdownArrow.contains(event.target)) {
        dropdownMenu.classList.remove("show");
      }
    });
  }
});