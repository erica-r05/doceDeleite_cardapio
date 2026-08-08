const auth = localStorage.getItem("auth");

if (!auth) {
  window.location.href = "login.html";
}
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("auth");
  window.location.href = "login.html";
});

//funções pra carregar a home administrativa
let produtosCardapio = []
let categoriaSelecionada = null
//codigo js pra home
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById("searchInput");

    if (searchInput) {
       searchInput.addEventListener("input", e => {
       buscarNoCardapio(e.target.value);
     });
    }
     carregarCardsProdutos();
});
async function carregarCardsProdutos() { /*função para carregar os cards das categorias*/
        const resposta = await fetch("../dados.json");
        const bancoDados = await resposta.json();
        const categorias = bancoDados.cards;
        const produtos = bancoDados.cardapio_produtos;
        const maisVendidosIds = bancoDados.populares;
        const categoriasContainer = document.querySelector('.produtos_cards');
        const maisVendidosContainer = document.querySelector('.mais_vendidos');
        // Cards normais
        categorias.forEach(categorias => {
            const card = document.createElement('div');
            card.classList.add('produto_card');
            card.innerHTML = `
        <div class="produto_card_inner">
          <img src="${categorias.imagem}" alt="${categorias.nome}" class="produto_imagem">
          <h3 class="produto_nome">${categorias.nome}</h3>
          <p class="produto_descricao">${categorias.descricao}</p>
          <a href="cardapioAdmin.html?categoria=${categorias.categoria}">
        Visualizar produtos
      </a>
        </div>
      `;
            categoriasContainer.appendChild(card);
        });

        // Cards dos mais vendidos
        maisVendidosIds.forEach(id => {
            const produto = produtos.find(p => p.id === id);
            if (!produto) return;

            const card = document.createElement('div');
            card.classList.add('mais_vendido');
            card.innerHTML = `
        <div class="produto_card_inner">
          <img src="${produto.imagem}" alt="${produto.nome}" class="produto_imagem">
          <h3 class="produto_nome">${produto.nome}</h3>
          <p class="produto_descricao">${produto.descricao}</p>
          <span class="preco">R$ ${produto.preco}</span>
        </div>
      `;
            maisVendidosContainer.appendChild(card);
        });
    }



