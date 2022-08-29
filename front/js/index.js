// Récupération des produits
fetch("http://localhost:3000/api/products")
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((products) => {
        console.log(products);
        displayProducts(products);
    })
    .catch((error) => {
        alert(error); // Une erreur est survenue
    });


/*
* Fonction d'affichage des produits sur la page
*/
function displayProducts(products) {
    // On récupére l'élément items situé dans le DOM
    const itemsContainer = document.getElementById('items');
    const fragment = document.createDocumentFragment();

    for (let product of products) {
        const element = createProduct(product);
        fragment.appendChild(element);
    }

    itemsContainer.appendChild(fragment);
}

/*
* Fonction de création des produits de manière dynamique
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