const productsInCart = localStorage.length;
const cart = [];

displayCart();
cart.forEach((product) => displayProducts(product));

function displayCart() {

    for (let i = 0; i < productsInCart; i++) {
        cart.push(JSON.parse(localStorage.getItem("cart")));
    }
}

function displayProducts(products) {

    const itemsContainer = document.getElementById('cart__items');
    const fragment = document.createDocumentFragment();

    for (let product of products) {
        const element = createProduct(product);
        fragment.appendChild(element);
    }

    itemsContainer.appendChild(fragment);
}

function createProduct(product) {
    const template = document.createElement('template');

    if (cart.length !== 0) {
        template.innerHTML = `
        <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.title}</h2>
                    <p>${product.colors}</p>
                    <p>${product.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>
    `;

    }else{
        template.innerHTML = `
        <h2>Le panier est vide</h2>
        <a href="index.html">
            <button class="homebtn">Retour à l'accueil</button>
        </a>`;
    }

    return template.content.firstElementChild;
}


