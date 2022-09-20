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

                     const removeButtons = document.getElementsByClassName('deleteItem');
                     console.log(removeButtons);
                     for (i = 0; i < removeButtons.length; i++) {
                         const removeButton = removeButtons[i];
                         removeButton.addEventListener("click", (e) => removeProduct(e));
                     }

                     const updateQuantity = document.getElementsByClassName("itemQuantity");
                     for (i = 0; i < updateQuantity.length; i++) {
                         const inputQuantity = updateQuantity[i];
                         inputQuantity.addEventListener("change", (e) => changeQuantity(e));
                     }
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
    <article class="cart__item" data-id="${product.id}" data-color="${product.colors}">
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

function removeProduct(event) {
    console.log(event.target);
    products = JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE));

    let id = event.target.closest("article").dataset.id;
    let color = event.target.closest("article").dataset.color;
    let index = products.findIndex(product => id === product.id && color === product.colors);
    console.log(index);

    products.splice(index, 1);

    // let newProduct = products;
    //
    // products.forEach((product, index) => {
    //     if (id === product.id && color === product.color) {
    //         newProduct = products.splice(index, 1);
    //     }
    // })
    localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(products));
    window.location.reload();
}

/** Update de quantité **/

function changeQuantity(event) {
    products = JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE));

    let id = event.target.closest("article").dataset.id;
    let color = event.target.closest("article").dataset.color;
    let productCart = products.find(product => product.id === id && product.colors === color);

    if (productCart) {
        productCart.quantity = Number(event.target.value);
        if (productCart.quantity <= 0 || productCart.quantity >= 101) {
            alert("Veuillez entrer un nombre entre 1 et 100.");
            return;
        }
    }

    localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(products));
    window.location.reload();
}


/** User form **/

let inputFirstName = document.getElementById('firstName');
let inputLastName = document.getElementById('lastName');
let inputAddress = document.getElementById('address');
let inputCity = document.getElementById('city');
let inputEmail = document.getElementById('email');

function orderForm() {

    const errorMessage = (tag, message, isValid) => {
        const inputsError = document.querySelector('#' + tag + 'ErrorMsg');
        if (isValid) {
            inputsError.textContent = "\u2713";
        } else {
            inputsError.textContent = message;
        }
    };

/** Validation des inputs en utilisant des regex **/

    const firstNameValidation = (value) => {
        if (value.match(/^[A-Za-zÀ-ÿ '.-]{2,15}$/)) {
            errorMessage('firstName', '', true);
            inputFirstName = value;
        } else {
            errorMessage('firstName',
            'La saisie du prénom est invalide. ' +
            'Il doit contenir entre 2 et 15 caractères, les caractères spéciaux autres que les lettres accentuées, ".", "-" et "\'" ne sont pas autorisés.');
            return false;
        }
    };

    const lastNameValidation = (value) => {
        if (value.match(/^[A-Za-zÀ-ÿ '.-]{2,20}$/)) {
            errorMessage('lastName', '', true);
            inputLastName = value;
        } else {
            errorMessage('lastName',
                'La saisie du prénom est invalide. ' +
                'Il doit contenir entre 2 et 15 caractères, les caractères spéciaux autres que les lettres accentuées, ".", "-" et "\'" ne sont pas autorisés.');
            return false;
        }
    };

    const addressValidation = (value) => {
        if (value.match(/^([0-9]*) ?([A-Za-zÀ-ÿ '.-]*) ?([0-9]{5}) ?([a-zA-Z]*)$/)) {
            errorMessage('address', '', true);
            inputAddress = value;
        } else {
            errorMessage ('address',
                'La saisie de l\'adresse est invalide. ' +
                'Elle doit contenir un numéro de rue ainsi que son nom et le code postal de la ville');
            return false;
        }
    };

    const cityValidation = (value) => {
        if (value.match('Y') || value.match(/^[A-Za-zÀ-ÿ '.-]{2,45}$/)) {
            errorMessage('city', '', true);
            inputCity = value;
        } else {
            errorMessage('city',
                'La saisie de la ville est invalide. ' +
                'Il doit contenir entre 2 et 45 caractères, les caractères spéciaux autorisés sont ".", "-" et "\'".');
            return false;
        }
    };

    const emailValidation = (value) => {
        if (value.match(/^[a-z0-9 ._-]+@[a-z]+\.[a-z]{2,3}/)){
            errorMessage('email', '', true);
            inputEmail = value;
        } else {
            errorMessage ('email',
                'La saisie de l\'email est invalide. ' +
                'L\'email doit être au format johndoe@gmail.com. Il peut contenir les caractères spéciaux "_", "-" et "." uniquement');
            return false;
        }
    };

    inputFirstName.addEventListener('input', (e) => {
        firstNameValidation(e.target.value);
    });
    inputLastName.addEventListener('input', (e) => {
        lastNameValidation(e.target.value);
    });
    inputAddress.addEventListener('input', (e) => {
        addressValidation(e.target.value);
    });
    inputCity.addEventListener('input', (e) => {
        cityValidation(e.target.value);
    });
    inputEmail.addEventListener('input', (e) => {
        emailValidation(e.target.value);
    });
}

orderForm();

function postOrderForm() {
    const submitButton = document.getElementById('order');
    submitButton.addEventListener('click', () => {

        if (inputFirstName && inputLastName && inputAddress && inputCity && inputEmail) {
            let orderProducts = [];
            orderProducts.push(JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE)));

            const order = {
                contact: {
                    firstName: inputFirstName.value,
                    lastName: inputLastName.value,
                    city: inputCity.value,
                    address: inputAddress.value,
                    email: inputEmail.value,
                },
                products: orderProducts,
            };

            const options = {
                method: "POST",
                body: JSON.stringify(order),
                headers: { "Content-Type": "application/json"},
            };
            fetch("http://localhost:3000/api/products/order", options)
                .then((res) => res.json())
                .then((data) => {
                    document.location.href = "confirmation.html?id=" + data.orderId;
                })
                .catch(function (error) {
                    console.error("Fetch Error", error);
                });
        }
    })
}
postOrderForm();
