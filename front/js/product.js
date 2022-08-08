// Récupération des paramètres id de l'url

let url = new URL(document.location.href).searchParams;
let id = url.get('id');

// if(url.has('id')) {console.log(id);}

// Requête API d'un seul produit par son id

let product = '';

async function pickProduct(id) {
    await fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => {
            return res.json()
        })
        .then((valueProduct) => {
            product = valueProduct;
        })
        .catch((error) => {
            console.error('Fetch Error', error);
        });
    return product;
}

async function createProduct(id) {
    let product = await pickProduct(id);

    let productTemplate = document.querySelector(".item__img");
    let productPhoto = `<img src='${product.imageUrl}' alt='${product.altTxt}'>`;

    let productName = document.getElementById('title');
    productName.innerHTML = product.name;

    let productPrice = document.getElementById('price');
    productPrice.innerHTML = product.price;

    let productDescription = document.getElementById('description');
    productDescription.innerHTML = product.description;

    for (let i = 0; i < product.colors.length; i++) {
        let productColors = document.getElementById('colors');
        let colorOption = document.createElement('option');
        colorOption.label = product.colors[i];
        productColors.add(colorOption);
    }

    productTemplate.innerHTML = productPhoto;
}

createProduct(id);
