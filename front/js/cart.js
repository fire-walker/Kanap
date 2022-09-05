const PRODUCTS_KEY_LOCALSTORAGE = 'products';

const cartTitle = document.getElementById('cart-title');
let products = [];

async function getProduct(id) {
    console.log("debut fonction getproduct");
    return await fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => {
            return res.json()
        })
        .then((product) => {
            console.log("fin fonction getProduct");
            return product;
        })
        .catch((error) => {
            console.error("Fetch Error", error);
        });
}

if (localStorageHas(PRODUCTS_KEY_LOCALSTORAGE)) {
    products = JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE));

    displayProducts();
} else {
    cartTitle.textContent = 'Le panier est vide';
}

function displayProducts() {
    const itemsContainer = document.getElementById('cart__items');
    const fragment = document.createDocumentFragment();

     // for (let product of products) {
     //
     //     const element = createProduct(product);
     //     fragment.appendChild(element);
     // }

    function newProduct(product, response = "default value") {
        console.log("début fonction testProduct");
        // console.log(response);

        const productFinal = product;
        productFinal.price = response;
        // console.log(productFinal);
        //console.log(productTest);

        const element = createProduct(productFinal);
        fragment.appendChild(element);
        console.log("fin fonction testproduct");
    }

    //console.log(products);

    products.map(product => {
        console.log(product);
        console.log("item-mapping");

        let productPrice = getProduct(product.id).price;
        newProduct(product, productPrice);
        console.log(productPrice);
    });

    console.log(fragment);
    itemsContainer.appendChild(fragment);
    //console.log(itemsContainer);
}

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