// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application loaded');
    function initializeCarousel() {
        const carouselElement = document.querySelector('#carouselExampleIndicators');
        if (carouselElement) {
            const carousel = new bootstrap.Carousel(carouselElement, {
                interval: 3000,
                ride: 'carousel'
            });
            console.log('Carousel initialized');
        }
    }

    function carouselControls() {
        const prevButton = document.querySelector('.carousel-control-prev');
        const nextButton = document.querySelector('.carousel-control-next');
        const carouselElement = document.querySelector('#carouselExampleIndicators');
        if (prevButton && nextButton && carouselElement) {
            const carousel = bootstrap.Carousel.getInstance(carouselElement);
            prevButton.addEventListener('click', () => carousel.prev());
            nextButton.addEventListener('click', () => carousel.next());
            console.log('Carousel controls set up');
        }
    }
    async function carregarCardsProdutos(){
            const resposta = await fetch ('dados.json');
            const bancoDados = await resposta.json();
            const produtos = bancoDados.cards;

        const produtosContainer = document.querySelector('.produtos_cards');
        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.classList.add('produto_card');
            card.innerHTML = `
            <div class="produto_card_inner">
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto_imagem">
                <h3 class="produto_nome">${produto.nome}</h3>
                <p class="produto_descricao">${produto.descricao}</p>
                <button class="detalhes_botao">Detalhes</button>
            </div>
            `;
            produtosContainer.appendChild(card);
        });
    }
    carregarCardsProdutos();
    initializeCarousel();
    carouselControls();
    // Add your code here
});