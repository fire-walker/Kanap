const url = new URL(document.location.href).searchParams;
const id = url.get("orderId");

const orderId = document.getElementById('orderId');
orderId.textContent = id;