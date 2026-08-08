let idEmEdicao = null;

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS CARREGADO");
  carregarCardapio();
  ativarPesquisa();
  ativarBotaoAdd();
  ativarFormProduto();
  ativarSelectCategoria();
});
//botão de add
function ativarBotaoAdd() {
  const botaoAdd = document.getElementById("btn-add");
  const form = document.getElementById("form-produto");
  const overlay = document.getElementById("form-overlay");
  if (!botaoAdd || !form) return;
  botaoAdd.addEventListener("click", () => {
    form.classList.remove("hidden");
    overlay?.classList.remove("hidden");
  });
}
//funções do localStorage
function getProdutos() {
  return JSON.parse(localStorage.getItem("produtos")) || [];
}

function salvarProdutos(produtos) {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}
//formulario
function ativarFormProduto() {
  const form = document.getElementById("form-produto");
  const btnCancelar = document.getElementById("cancelar");
  if (!form || !btnCancelar) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const produtoData = {
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      preco: document.getElementById("preco").value,
      imagem: document.getElementById("imagem").value,
      categoria: document.getElementById("categoria").value
    };
    const produtos = getProdutos();
    if (idEmEdicao) {
      const index = produtos.findIndex(p => p.id === idEmEdicao);
      produtos[index] = { ...produtos[index], ...produtoData };
    } else {
      produtos.push({
        id: Date.now(),
        ...produtoData
      });
    }
    salvarProdutos(produtos);
    fecharFormulario();
    carregarCardapio();
  });
  btnCancelar.addEventListener("click", fecharFormulario);
}
//fecha o formulario 
function fecharFormulario() {
  idEmEdicao = null;
  const form = document.getElementById("form-produto");
  const overlay = document.getElementById("form-overlay");
  form.reset();
  form.classList.add("hidden");
  overlay?.classList.add("hidden");
  document.querySelector(".form-produto h3").innerText = "Novo produto";
  document.querySelector(".form-produto button[type='submit']").innerText = "Salvar";
}

function ativarSelectCategoria() {
  const select = document.getElementById("categoria");
  const inputNova = document.getElementById("novaCategoria");
  if (!select || !inputNova) return;
  select.addEventListener("change", e => {
    inputNova.classList.toggle("hidden", e.target.value !== "outros");
  });
}
//excluir
function excluirProduto(id) {
  const produtos = getProdutos();
  const atualizados = produtos.filter(p => p.id !== id);
  salvarProdutos(atualizados);
  carregarCardapio();
}
//editar
function abrirFormularioEdicao(id) {
  const produtos = getProdutos();
  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    alert("Este produto não pode ser editado.");
    return;
  }
  idEmEdicao = id;
  document.getElementById("nome").value = produto.nome;
  document.getElementById("descricao").value = produto.descricao;
  document.getElementById("preco").value = produto.preco;
  document.getElementById("imagem").value = produto.imagem;
  document.getElementById("categoria").value = produto.categoria;
  document.querySelector(".form-produto h3").innerText = "Editar produto";
  document.querySelector(".form-produto button[type='submit']").innerText = "Salvar alterações";
  document.getElementById("form-produto").classList.remove("hidden");
  document.getElementById("form-overlay")?.classList.remove("hidden");
}
//caarrega o cardapio
async function carregarCardapio() {
  const params = new URLSearchParams(window.location.search);
  const categoriaSelecionada = params.get("categoria");
  const resposta = await fetch("/docs/dados.json");
  const bancoDados = await resposta.json();
  const produtosJson = bancoDados.cardapio_produtos.map(p => ({
    ...p,
    id: null
  }))
  const produtosLocal = getProdutos();
  const produtos = [...produtosJson, ...produtosLocal];
  const container = document.querySelector(".produtos_container");
  container.innerHTML = "";
  const criarCard = produto => `
    <div class="produto_card" data-id="${produto.id}">
      <div class="card-menu">
        <button class="menu-btn" type="button">⋮</button>
        <div class="menu-options">
          <button class="edit-btn" type="button">Editar</button>
          <button class="delete-btn" type="button">Excluir</button>
        </div>
      </div>
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3 class="produto_nome">${produto.nome}</h3>
      <p class="produto_descricao">${produto.descricao}</p>
      <span class="preco">R$ ${produto.preco}</span>
    </div>
  `;
  if (categoriaSelecionada) {
    const filtrados = produtos.filter(p => p.categoria === categoriaSelecionada);
    container.innerHTML = `
      <section class="categoria_secao">
        <h2>${categoriaSelecionada.replace("_", " ")}</h2>
        <div class="produtos_cards">
          ${filtrados.map(criarCard).join("")}
        </div>
      </section>
    `;
    return;
  }
  const categorias = [...new Set(produtos.map(p => p.categoria))];
  categorias.forEach(categoria => {
    const produtosDaCategoria = produtos.filter(p => p.categoria === categoria);
    const secao = document.createElement("section");
    secao.classList.add("categoria_secao")
    secao.innerHTML = `
      <h2>${categoria.replace("_", " ")}</h2>
      <div class="produtos_cards">
        ${produtosDaCategoria.map(criarCard).join("")}
      </div>
    `;
    container.appendChild(secao);
  });
}
//menu
document.addEventListener("click", e => {
  const btnMenu = e.target.closest(".menu-btn");
  if (btnMenu) {
    e.stopPropagation();
    const menu = btnMenu.nextElementSibling;
    document.querySelectorAll(".menu-options")
      .forEach(m => m !== menu && m.classList.remove("open"));
    menu.classList.toggle("open");
    return;
  }
  const btnDelete = e.target.closest(".delete-btn");
  if (btnDelete) {
    e.stopPropagation();
    const card = btnDelete.closest(".produto_card");
    const id = Number(card.dataset.id);
    if (!id) {
      alert("Este produto não pode ser excluído.");
      return;
    }
    if (confirm("Deseja excluir este produto?")) {
      excluirProduto(id);
    }
    return;
  }
  const btnEdit = e.target.closest(".edit-btn");
  if (btnEdit) {
    e.stopPropagation();
    const card = btnEdit.closest(".produto_card");
    const id = Number(card.dataset.id);
    abrirFormularioEdicao(id);
    return;
  }
  document.querySelectorAll(".menu-options")
    .forEach(menu => menu.classList.remove("open"));
});
//barra de pesquisa
function ativarPesquisa() {
  const inputPesquisa = document.querySelector(".pesquisa");
  if (!inputPesquisa) return;

  inputPesquisa.addEventListener("input", e => {
    buscarNoCardapio(e.target.value);
  });
}
//busca
function buscarNoCardapio(texto) {
  const termo = texto.toLowerCase();
  const cards = document.querySelectorAll(".produto_card");

  cards.forEach(card => {
    const nome = card.querySelector(".produto_nome")?.textContent.toLowerCase() || "";
    const descricao = card.querySelector(".produto_descricao")?.textContent.toLowerCase() || "";

    card.style.display =
      nome.includes(termo) || descricao.includes(termo) ? "" : "none";
  });
}
