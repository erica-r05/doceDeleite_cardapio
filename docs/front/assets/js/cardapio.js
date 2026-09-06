function getBasePath() {
  return window.location.pathname.includes("/pages/admin/") ? "../../" : "../";
}

document.addEventListener('DOMContentLoaded', () => {
    carregarCardapio();
}); //carrega o cardapio da versão regular 
async function carregarCardapio() { //carrega o filtro e o cardapio
    const params = new URLSearchParams(window.location.search);
    const categoriaSelecionada = params.get("categoria");
    const resposta = await fetch('dados.json');
    const bancoDados = await resposta.json();
    const produtos = bancoDados.cardapio_produtos;
    const container = document.querySelector(".produtos_container");

    // Função para criar o card
    const criarCard = produto => `
    <div class="produto_card">
      <img src="${getBasePath()}${produto.imagem}" alt="${produto.nome}" class="produto_imagem">
          <h3 class="produto_nome">${produto.nome}</h3>
          <p class="produto_descricao">${produto.descricao}</p>
          <span class="preco">R$ ${produto.preco}</span>
          <a href="#" class="btn-wpp" data-produto="${produto.nome}">
            Pedir pelo WhatsApp
          </a>
    </div>
  `;

    // com filtro
    if (categoriaSelecionada) {
        const filtrados = produtos.filter(
            p => p.categoria === categoriaSelecionada
        );
        container.innerHTML = `
      <section class="categoria_secao">
        <h2>${categoriaSelecionada.replace("_", " ")}</h2>
        <div class="produtos_cards">
          ${filtrados.map(criarCard).join("")}
        </div>
      </section>
    `;
    }
    // sem filtro
    else {
        const categorias = [...new Set(produtos.map(p => p.categoria))];
        categorias.forEach(categoria => {
            const produtosDaCategoria = produtos.filter(
                p => p.categoria === categoria
            );
            const secao = document.createElement("section");
            secao.classList.add("categoria_secao");
            secao.innerHTML = `
        <h2>${categoria.replace("_", " ")}</h2>
        <div class="produtos_cards">
          ${produtosDaCategoria.map(criarCard).join("")}
        </div>
      `;
            container.appendChild(secao);
        });
    }
}
function buscarNoCardapio(texto) { //barra de pesquisa do cardapio
  const termo = texto.toLowerCase();

  const cards = document.querySelectorAll(".produto_card");

  cards.forEach(card => {
    const nome = card.querySelector(".produto_nome")?.textContent.toLowerCase() || "";
    const descricao = card.querySelector(".produto_descricao")?.textContent.toLowerCase() || "";

    if (nome.includes(termo) || descricao.includes(termo)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
}