const PRODUCTS_KEY_LOCALSTORAGE = 'products';

/**
 * Fonction de sauvegarde des produits dans le localStorage
 * @param {Array} products
 */
function localStorageSave(products) {
    localStorage.setItem(PRODUCTS_KEY_LOCALSTORAGE, JSON.stringify(products));
}

/**
 * Récupère la valeur du localStorage
 * @return {Array}
 */
function localStorageGet() {
    return localStorageHas() ? JSON.parse(localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE)) : [];
}

/**
 * On vérifie que la clé existe dans le localStorage
 * @return {Boolean}
 */
function localStorageHas() {
    return !!localStorage.getItem(PRODUCTS_KEY_LOCALSTORAGE);
}

export { localStorageSave, localStorageGet, localStorageHas };
