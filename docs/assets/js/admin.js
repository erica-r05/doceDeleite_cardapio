const auth = localStorage.getItem("auth");

if (!auth) {
  window.location.href = "login.html";
}
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
});
