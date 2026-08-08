const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

document.addEventListener("DOMContentLoaded", () => {
  // botão de ir para cadastro
  const botaoCadastro = document.querySelector(".cadastro");
  if (botaoCadastro) {
    botaoCadastro.addEventListener("click", () => {
      window.location.href = "cadastro.html";
    });
  }

  // formulário de login
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;

    if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
      localStorage.setItem("auth", "true");
      window.location.href = "admin.html";
    } else {
      document.getElementById("erro").style.display = "block";
    }
  });
});
