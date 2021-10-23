import "/libs/jquery.js";
const navbarContainer = document.createElement("div");
navbarContainer.id = "navigation";
document.body.prepend(navbarContainer);
$(function() {
    $("#navigation").load("/navbar.html");
});