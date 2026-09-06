function getBasePath() {
  return window.location.pathname.includes("/pages/admin/") ? "../../" : "../";
}

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

   document.addEventListener("click", event => {   //leva o cliente para o chat do wpp
        const botao = event.target.closest(".btn-wpp");
        if (!botao) return;
        event.preventDefault();
        const telefone = "5531997982551";
        const produto = botao.dataset.produto;
        const mensagem = `Oi! Gostaria de pedir o produto: ${produto} `;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, "_blank");
    });
     carregarCardsProdutos();
});
async function carregarCardsProdutos() { /*função para carregar os cards das categorias*/
        const resposta = await fetch('dados.json');
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
          <img src="${getBasePath()}${categorias.imagem}" alt="${categorias.nome}" class="produto_imagem">
          <h3 class="produto_nome">${categorias.nome}</h3>
          <p class="produto_descricao">${categorias.descricao}</p>
          <a href="cardapio.html?categoria=${categorias.categoria}">
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
          <img src="${getBasePath()}${produto.imagem}" alt="${produto.nome}" class="produto_imagem">
          <h3 class="produto_nome">${produto.nome}</h3>
          <p class="produto_descricao">${produto.descricao}</p>
          <span class="preco">R$ ${produto.preco}</span>
          <a href="#" class="btn-wpp" data-produto="${produto.nome}">
            Pedir pelo WhatsApp
          </a>
        </div>
      `;
            maisVendidosContainer.appendChild(card);
        });
    }