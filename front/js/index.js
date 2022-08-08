// Récupération des produits
fetch("http://localhost:3000/api/products")
    .then((res) => {
        if (res.ok) {
            return res.json();
        }
    })
    .then((products) => {
        console.log(products);
        createProducts(products);
    })
    .catch((error) => {
        alert(); // Une erreur est survenue
    });


// Affichage des produits dans le DOM
function createProducts(products) {
    const sectionItems = document.getElementById('items');
    let content = '';

    for (let product of products) {
        content += `
                <a href="./product.html?id=${product._id}">
                    <article>
                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                        <h3 class="productName">${product.name}</h3>
                        <p class="productDescription">${product.description}</p>
                    </article>
                </a>`;
    }

    sectionItems.innerHTML = content;
}