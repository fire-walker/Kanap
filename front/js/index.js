// Récupération des produits disponibles dans l'API
fetch("http://localhost:3000/api/products")
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((products) => {
        displayProducts(products);
    })
    .catch((error) => {
        alert("Aucun produit n'a pu être trouvé. Assurez-vous d'avoir lancé le serveur local avant de recharger la page."); // Une erreur est survenue
    });


/**
 * Fonction d'affichage des produits sur la page
 * @param {Response} products
 */
function displayProducts(products) {
    // On récupère l'élément items situé dans le DOM
    const itemsContainer = document.getElementById('items');
    const fragment = document.createDocumentFragment();

    for (let product of products) {
        const link = createProduct(product);
        fragment.appendChild(link);
    }

    itemsContainer.appendChild(fragment);
}

/**
 * Convertir une chaîne de caractères en élément HTML
 * @param {Object} product
 * @return {HTMLElement}
 */
function createProduct(product) {
    const template = document.createElement('template');
    template.innerHTML = `
        <a href="./product.html?id=${product._id}">
            <article>
                <img src="${product.imageUrl}" alt="${product.altTxt}">
                <h3 class="productName">${product.name}</h3>
                <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `;

    return template.content.firstElementChild;
}
