const PRODUCTS_KEY_LOCALSTORAGE = 'products';

/**
 * Récupération des paramètres id présents de l"url
 */
const url = new URL(document.location.href).searchParams;
const id = url.get("id");

const button = document.getElementById("addToCart");
const productColors = document.getElementById("colors-select");
const productQuantity = document.getElementById("item-quantity");

/***************** On load *******************/
(async function init() {
    await createProduct(id);

    const image = document.getElementById("image");
    const description = document.getElementById("description");
    //const price = document.getElementById("price");
    const title = document.getElementById("title");

    /**
     * Ajout d'un événement sur le bouton qui ajoute un produit au panier
     * - Récupérer toutes les informations nécessaires afin de créer un objet produit
     * - altxt, id, image, couleur, description, quantité, prix, titre
     * - Ajouter le produit au panier
     * - Ajout d'évènement sur les champs de couleurs et de quantité
     */
    button.addEventListener("click", () => {
        const quantity = Number(productQuantity.value);

        if (productColors.value && quantity > 0 && quantity < 100) {
            const product = {
                altTxt: image.alt,
                colors: productColors.value,
                description: description.innerHTML,
                id: id,
                imageUrl: image.src,
                //price: price.innerHTML,
                quantity: quantity,
                title: title.innerHTML
            };

            addToCart(product);
            alert("Le produit a bien été ajouté au panier");
        }
    });

    productColors.addEventListener("change", buttonColorQuantityChange);
    productQuantity.addEventListener("change", buttonColorQuantityChange);
})();

/**
 * Fonction d'ajout des produits au panier
 * - Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà présent dans le panier, on ajoute un nouvel élément dans l’array.
 * - Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array
 * - Si un objet existe déjà dans le LS et correspond à l'objet que l'on souhaite rajouter, modifier la quantité
 * - Sinon, on rajoute le produit dans le localStorage.
 */
function addToCart(product) {
    const cart = getCart();
    const colors = productColors.value;

    let productCart = cart.find(p => p.id === id && p.colors === colors);

    if (productCart) {
        productCart.quantity = productCart.quantity + product.quantity;
    } else {
        cart.push(product);
    }

    saveCart(cart);
}

/**
 * Fonction de requête API d'un seul produit par son id
 * @async
 */

async function getProduct(id) {
    return await fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => {
            return res.json()
        })
        .then((product) => {
            return product;
        })
        .catch((error) => {
            console.error("Fetch Error", error);
        });
}

/**
 * Fonction de création du produit dont l'id a été fetch
 * @async
 */
async function createProduct(id) {
    const product = await getProduct(id);

    const productTemplate = document.querySelector(".item__img");
    const productPhoto = `<img src="${product.imageUrl}" id="image" alt="${product.altTxt}">`;

    const productName = document.getElementById("title");
    productName.innerHTML = product.name;

    const productPrice = document.getElementById("price");
    productPrice.innerHTML = product.price;

    const productDescription = document.getElementById("description");
    productDescription.innerHTML = product.description;

    console.log(productColors);

    for (let i = 0; i < product.colors.length; i++) {
        let colorOption = document.createElement("option");
        colorOption.value = product.colors[i];
        colorOption.label = product.colors[i];

        productColors.add(colorOption);
    }

    productTemplate.innerHTML = productPhoto;
}

/**
 * Fonction de sauvegarde du produit dans le Local Storage
 */
function saveCart(products) {
    localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(products));
}

function getCart() {
    return hasCart() ? JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE)) : [];
}

function hasCart() {
    return !!localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE);
}

/**
 * Fonction pour activer ou désactiver le bouton d'ajout au panier
 * - Si aucune couleur ou aucune quantité n'est choisie le bouton reste désactivé
 * - Si les deux champs sont remplis le bouton s'active et le produit peut être ajouté
 */
function buttonColorQuantityChange() {
    const colorsDefaultValue = 'Sélectionnez une couleur';
    const colorsSelectedValue = productColors.value;

    const quantityValue = Number(productQuantity.value);
    const checkQuantity = quantityValue >= 1 && quantityValue <= 100;

    if (checkQuantity && (colorsSelectedValue && colorsSelectedValue !== colorsDefaultValue)) {
        button.setAttribute("aria-disabled", "false");
    } else {
        button.setAttribute("aria-disabled", "true");
    }
}
