/**
 * Récupération des paramètres id présents dans l'url
 * - Afficher l'id dans la page de confirmation
 */
const url = new URL(document.location.href).searchParams;
const id = url.get("orderId");

const orderId = document.getElementById('orderId');
orderId.textContent = id;
