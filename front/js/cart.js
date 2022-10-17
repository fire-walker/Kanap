import { localStorageSave, localStorageGet, localStorageHas } from "./localstorage.js";

const PRODUCTS_KEY_LOCALSTORAGE = 'products';

const cartTitle = document.getElementById('cart-title');
const itemsContainer = document.getElementById('cart__items');
const form = document.getElementById('formOrder');

let products = localStorageGet();

// Affichage des produits stockés dans le LS
if (localStorageHas()) {
    init();
} else {
    cartTitle.textContent = 'Le panier est vide';
}

/**
 * Fonction d'initialisation
 * - Afficher les produits présents dans le Local Storage
 * - Récupérer toutes les informations nécessaires afin de créer un objet contact
 */
function init() {
    displayProducts();

    const errorMessage = (tag, message, isValid) => {
        const inputsError = document.querySelector('#' + tag + 'ErrorMsg');
        if (isValid) {
            inputsError.textContent = "\u2713";
        } else {
            inputsError.textContent = message;
        }
    };

    let contact = {
        firstName: null,
        lastName: null,
        address: null,
        city: null,
        email: null
    };

    // Validation des inputs en utilisant des regex
    const firstNameValidation = (value) => {
        if (value.match(/^[A-Za-zÀ-ÿ '.-]{2,15}$/)) {
            errorMessage('firstName', '', true);
            contact.firstName = value;
        } else {
            errorMessage('firstName',
                'La saisie du prénom est invalide. ' +
                'Il doit contenir entre 2 et 15 caractères, les caractères spéciaux autres que les lettres accentuées, ".", "-" et "\'" ne sont pas autorisés.');
            contact.firstName = null;
        }
    };
    const lastNameValidation = (value) => {
        if (value.match(/^[A-ZÀ-Ÿ '.-]{2,20}$/)) {
            errorMessage('lastName', '', true);
            contact.lastName = value;
        } else {
            errorMessage('lastName',
                'La saisie du prénom est invalide. ' +
                'Il doit contenir entre 2 et 15 caractères en majuscule, les caractères spéciaux autres que les lettres accentuées, ".", "-" et "\'" ne sont pas autorisés.');
            contact.lastName = null;
        }
    };
    const addressValidation = (value) => {
        if (value.match(/^[A-Za-zÀ-ÿ0-9 '.,-]{8,45}$/)) {
            errorMessage('address', '', true);
            contact.address = value;
        } else {
            errorMessage ('address',
                'La saisie de l\'adresse est invalide. ' +
                'Elle doit contenir un numéro de rue ainsi que son nom, un lieu dit ou une commune.');
            contact.address = null;
        }
    };
    const cityValidation = (value) => {
        if (value.match('Y') || value.match(/^[A-Za-zÀ-ÿ '.-]{2,45}$/)) {
            errorMessage('city', '', true);
            contact.city = value;
        } else {
            errorMessage('city',
                'La saisie de la ville est invalide. ' +
                'Elle doit contenir entre 2 et 45 caractères, les caractères spéciaux autorisés sont ".", "-" et "\'".');
            contact.city = null;
        }
    };
    const emailValidation = (value) => {
        if (value.match(/^[a-z0-9 ._-]+@[a-z]+\.[a-z]{2,3}/)){
            errorMessage('email', '', true);
            contact.email = value;
        } else {
            errorMessage ('email',
                'La saisie de l\'email est invalide. ' +
                'L\'email doit être au format johndoe@gmail.com. Il peut contenir les caractères spéciaux "_", "-" et "." uniquement');
            contact.email = null;
        }
    };

    /**
     * Ajout d'évènement sur chaque champ du formulaire
     * Ajout d'un événement sur le bouton qui soumet le formulaire
     */
    form.firstName.addEventListener('input', (e) => {
        firstNameValidation(e.target.value);
    });
    form.lastName.addEventListener('input', (e) => {
        lastNameValidation(e.target.value);
    });
    form.address.addEventListener('input', (e) => {
        addressValidation(e.target.value);
    });
    form.city.addEventListener('input', (e) => {
        cityValidation(e.target.value);
    });
    form.email.addEventListener('input', (e) => {
        emailValidation(e.target.value);
    });

    const submitButton = document.getElementById('order');
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (contact.firstName && contact.lastName && contact.address && contact.city && contact.email) {
            sendOrder(contact);
        }else{
            alert("Merci de remplir tous les champs du formulaire.");
        }
    });
}

/**
 * Fonction d'affichage des produits sur la page
 */
function displayProducts() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        // Fetch API pour récupérer le prix des produits qui n'est pas stocké dans le LS
        fetch(`http://localhost:3000/api/products/${product.id}`)
            .then((res) => {
                return res.json()
            })
            .then((apiProduct) => {
                const article = createProduct(product, apiProduct.price);
                fragment.appendChild(article);

                if (i === products.length - 1) {
                    itemsContainer.appendChild(fragment);

                    const removeButtons = document.getElementsByClassName('deleteItem');
                    for (i = 0; i < removeButtons.length; i++) {
                        const removeButton = removeButtons[i];
                        removeButton.addEventListener("click", (e) => removeProduct(e));
                    }

                    const updateQuantity = document.getElementsByClassName('itemQuantity');
                    for (i = 0; i < updateQuantity.length; i++) {
                        const inputQuantity = updateQuantity[i];
                        inputQuantity.addEventListener("change", (e) => changeQuantity(e));
                    }
                }

                displayCartQuantity();
                displayCartPrice();
            })
            .catch((error) => {
                console.error("Fetch Error", error);
            });
    }
}

/**
 * Fonction de création des produits stockés dans le localStorage de manière dynamique
 * @param {Object} product
 * @param {Number} price
 * @return {HTMLElement}
 */
function createProduct(product, price) {
    product.price = price;

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
                <p>${price}€</p>
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
 * Fonction de suppression des produits
 * - Récupérer l'id et la couleur du produit voulu
 * - Modification du contenu du tableau en supprimant le produit
 * - Affichage des nouveaux totaux prix et quantité
 * @param {Event} event
 */
function removeProduct(event) {
    const article = event.target.closest("article");

    let id = article.dataset.id;
    let color = article.dataset.color;

    let index = products.findIndex(product => id === product.id && color === product.colors);

    products.splice(index, 1);
    article.remove();
    localStorageSave(products);

    displayCartPrice();
    displayCartQuantity();
}

/**
 * Fonction d'update de quantité
 * - Récupérer l'id et la couleur du produit voulu
 * - Affichage des nouveaux totaux prix et quantité
 * @param {Event} event
 */
function changeQuantity(event) {
    const article = event.target.closest("article");

    let id = article.dataset.id;
    let color = article.dataset.color;
    let productCart = products.find(product => product.id === id && product.colors === color);

    if (productCart) {
        productCart.quantity = Number(event.target.value);

        if (productCart.quantity <= 0 || productCart.quantity >= 101) {
            alert("Veuillez entrer un nombre entre 1 et 100.");
            return;
        }
    }

    localStorageSave(products);

    displayCartPrice();
    displayCartQuantity();
}

/**
 * Fonction d'affichage du total prix
 */
function displayCartPrice() {
    let totalPrice = 0;
    const cartPrice = document.getElementById('totalPrice');

    products.forEach((product) => {
        const totalProductPrice = product.price * product.quantity;
        totalPrice += totalProductPrice;
    });

    cartPrice.textContent = totalPrice;
}

/**
 * Fonction d'affichage de la quantité totale
 */
function displayCartQuantity() {
    let totalQuantity = 0;
    const cartQuantity = document.getElementById('totalQuantity');

    products.forEach((product) => {
        const totalProductQuantity = product.quantity;
        totalQuantity += totalProductQuantity;
    });

    cartQuantity.textContent = totalQuantity;
}

/**
 * Fonction d'envoi de la commande
 * - Stocker des informations nécessaire dans l'objet contact
 * - Envoyer les données à l'API
 * - Récupérer l'orderId fournit grâce à la méthode POST
 * - Rediriger vers la page de confirmation avec l'orderId présent dans l'url
 * @param {Object} contact
 */
function sendOrder(contact) {
    const body = {
        contact: {
            firstName: contact.firstName,
            lastName: contact.lastName,
            city: contact.city,
            address: contact.address,
            email: contact.email,
        },
        products: products.map(product => product.id),
    };

    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId;

            localStorage.removeItem(PRODUCTS_KEY_LOCALSTORAGE);
            window.location.href = "confirmation.html" + "?orderId=" + orderId;
        })
        .catch(function (error) {
            console.error("Fetch Error", error);
        });
}
