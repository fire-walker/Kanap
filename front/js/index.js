//Récupération des produits
fetch("http://localhost:3000/api/produtcs")
    .then(function (res){
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value){
        console.log(value);
    })
    .catch(function(error) {
        alert(); //une erreur est survenue
    });


//Affichage des produits dans le DOM
function createProducts(products){
    for (let product of products) {

        let productLink = document.createElement("a");
        document.querySelector("#items").appendChild(productLink);
        productLink.href = `../../html/product.html?id=${products[product]}._id`;

        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;

        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");

        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productDescription");
    }
}