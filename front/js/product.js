// Récupération des paramètres id de l"url
const url = new URL(document.location.href).searchParams;
const id = url.get("id");
const cart = getCart();


/***************** On load *******************/
(async function init() {
    await createProduct(id);

    const button = document.getElementById("addToCart");
    const colors = document.getElementById("colors");
    const image = document.getElementById("image");
    const description = document.getElementById("description");
    const quantity = document.getElementById("quantity");
    const price = document.getElementById("price");
    const title = document.getElementById("title");

    /**
     * Ajout d'un événement sur le bouton qui ajoute un produit au panier
     * - Récupérer toutes les informations nécessaires afin de créer un objet produit
     *   - altxt, id, image, couleur, description, quantité, prix, titre
     * - Ajouter le produit au panier
     */
    button.addEventListener("click", () => {
        const value = Number(quantity.value);

        if (colors.value && value > 0 && value < 100) {
            const product = {
                altTxt: image.alt,
                colors: colors.value,
                description: description.innerHTML,
                id: id,
                imageUrl: image.src,
                price: price.innerHTML,
                quantity: value,
                title: title.innerHTML
            };

            addToCart(product);
        }
    });})();

function addToCart(product) {
    // - Lorsqu’on ajoute un produit au panier, si celui-ci n'était pas déjà présent dans le panier, on ajoute un nouvel élément dans l’array.
    // - Lorsqu’on ajoute un produit au panier, si celui-ci était déjà présent dans le panier (même id + même couleur), on incrémente simplement la quantité du produit correspondant dans l’array

    // TODO :
    // - Récupérer le contenu du LS -> appeler la fonction getcart

    if (localStorage.getItem("products") !== null) {
        getCart(product);

    } else {
        console.log(id);
        console.log(cart);
        let productCart = cart.find(p => p.id === id && p.colors === colors.value);

        // - Si un objet existe déjà dans le LS et correspond à l'objet que l'on souhaite rajouter, modifier la quantité
        if (productCart !== undefined) {
            productCart.quantity++;

            // - S'il n'y a aucun objet correspondant dans le LS, ajouter l'objet au LS
        } else {
            cart.push(product);
        }

        saveCart(cart);
        console.log(productCart?.quantity);

        //} else {
        // TODO :
        // - Créer une clé qui contiendra la valeur du produit [{}]
        // - Appeler la fonction savecart
    }
}

// Requête API d"un seul produit par son id
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

async function createProduct(id) {
    const product = await getProduct(id);

    console.log(product)

    const productColors = document.getElementById("colors");
    const productTemplate = document.querySelector(".item__img");
    const productPhoto = `<img src="${product.imageUrl}" id="image" alt="${product.altTxt}">`;

    const productName = document.getElementById("title");
    productName.innerHTML = product.name;

    const productPrice = document.getElementById("price");
    productPrice.innerHTML = product.price;

    const productDescription = document.getElementById("description");
    productDescription.innerHTML = product.description;

    for (let i = 0; i < product.colors.length; i++) {
        let colorOption = document.createElement("option");
        colorOption.value = product.colors[i];
        colorOption.label = product.colors[i];

        productColors.add(colorOption);
    }

    productTemplate.innerHTML = productPhoto;
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getCart() {
    if (hasCart()) {
        return JSON.parse(localStorage.getItem("cart"));
    } else {
        return [];
    }
}

function hasCart() {
    return !!localStorage.getItem("cart");
}
