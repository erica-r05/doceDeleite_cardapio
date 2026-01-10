document.getElementById("cadastroForm").addEventListener("submit", e => {
  e.preventDefault();
    alert("js ok")
  const usuario = document.getElementById("novoAdm").value;
  const senha = document.getElementById("novaSenha").value;
    // o sistema so permin=te o cadastro de UM administrador
  if (localStorage.getItem("admin")) {
    document.getElementById("msg").textContent =
      "Administrador já cadastrado.";
    return;
  }

  const admin = {
    usuario,
    senha
  };

  localStorage.setItem("admin", JSON.stringify(admin));
  document.getElementById("msg").textContent =
    "Administrador cadastrado com sucesso!";
    window.location.href = "login.html";
});
