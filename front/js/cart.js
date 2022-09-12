const PRODUCTS_KEY_LOCALSTORAGE = 'products';

const cartTitle = document.getElementById('cart-title');
let products = [];

/** Affichage des produits stockés dans le LS **/

if (localStorageHas(PRODUCTS_KEY_LOCALSTORAGE)) {
    products = JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE));

    displayProducts();
} else {
    cartTitle.textContent = 'Le panier est vide';
}

const itemsContainer = document.getElementById('cart__items');

function displayProducts() {
    const fragment = document.createDocumentFragment();

     for (let i = 0; i < products.length; i++) {
         const product = products[i];
         //console.log(product);


         /** Fetch API pour récupérer le prix des produits qui n'est pas stocké dans le LS **/

         fetch(`http://localhost:3000/api/products/` + product.id)
             .then((res) => {
                 return res.json()
             })
             .then((apiProduct) => {
                 newProduct(product, apiProduct.price);
                 //console.log(apiProduct);
                 //console.log(apiProduct.price);

                 if (i === products.length - 1) {
                     itemsContainer.appendChild(fragment);
                 }

                 /** Affichage des totaux prix et quantité **/

                 function displayCartPrice() {
                     let totalPrice = 0;
                     const cartPrice = document.getElementById('totalPrice');

                     products.forEach((product) => {
                         const totalProductPrice = product.price * product.quantity;
                         totalPrice += totalProductPrice;
                     })

                     cartPrice.innerHTML = totalPrice;
                 }

                 function displayCartQuantity() {
                     let totalQuantity = 0;
                     const cartQuantity = document.getElementById('totalQuantity');

                     products.forEach((product) => {
                         const totalProductQuantity = product.quantity;
                         totalQuantity += totalProductQuantity;
                     })

                     cartQuantity.innerHTML = totalQuantity;
                 }

                 displayCartPrice();
                 displayCartQuantity();
                 })

             .catch((error) => {
                 console.error("Fetch Error", error);
             });
     }

    function newProduct(product, response) {
        const productFinal = product;
        productFinal.price = response;

        const element = createProduct(productFinal);
        fragment.appendChild(element);
    }
}

/** Création des produits du LS **/

function createProduct(product) {
    const template = document.createElement('template');
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

    return template.content.firstElementChild;
}


/**
 * On vérifie que la clé existe dans le localStorage
 * @param {String} key
 * @return {Boolean}
 */
function localStorageHas(key) {
    const item = localStorage.getItem(key);
    return item !== null;
}

/** Suppression de produit **/

const removeButton = document.getElementsByClassName('deleteItem');
removeButton.addEventListener("click", () => removeProduct());

function removeProduct(id, color) {
    products = JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE));

    products.forEach((product, index) => {
        if (id === product.id && color === product.color) {
            products.splice(index, 1);
        }
        localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(product));
    })

    // const removeProduct = products.findIndex(product => product.id === item.id && product.color === item.color);
    // products.splice(removeProduct, 1);
    // console.log(item);
}

// function deleteItemFromCart(productId){
//     const removeProduct = products.filter(item => item.id !== productId);
//     localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(removeProduct));
// }
//
// deleteItemFromCart("107fb5b75607497b96722bda5b504926");
