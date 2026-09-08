console.log("hola");

document.addEventListener("DOMContentLoaded", function() {
const productos = document.querySelectorAll(".product-card");
const formulario = document.querySelector(".filters-form");
const buscador = document.querySelector("#product-search");
const ordenar = document.querySelector("#sort-products");
const contador = document.querySelector(".catalog-header__results");
const catalogo = document.querySelector(".catalog-grid");

function filtrar() {
const texto = buscador.value.toLowerCase().trim();
const categorias = [...document.querySelectorAll('input[name="category"]:checked')].map(x => x.value.toLowerCase());
const plataformas = [...document.querySelectorAll('input[name="platform"]:checked')].map(x => x.value.toLowerCase());
const precio = document.querySelector('input[name="price"]:checked');
const disponible = document.querySelector('input[name="availability"]:checked');
let cantidad = 0;

productos.forEach(producto => {
const nombre = producto.querySelector(".product-card__title").textContent.toLowerCase();
const categoria = producto.querySelector(".product-card__category").textContent.toLowerCase();
const precioNumero = parseInt(producto.querySelector(".product-card__price").textContent.replace(/\D/g, ""));
let mostrar = true;

if(texto && !nombre.includes(texto)) mostrar = false;
if(categorias.length && !categorias.includes(categoria)) mostrar = false;

if(precio) {
if(precio.value === "low" && precioNumero >= 20000) mostrar = false;
if(precio.value === "medium" && (precioNumero < 20000 || precioNumero > 40000)) mostrar = false;
if(precio.value === "high" && precioNumero <= 40000) mostrar = false;
}

if(plataformas.length) {
const datos = (producto.dataset.platforms || "").toLowerCase().split(",");
if(!plataformas.some(x => datos.includes(x))) mostrar = false;
}

if(disponible && producto.dataset.available !== "true") mostrar = false;

producto.style.display = mostrar ? "" : "none";
if(mostrar) cantidad++;
});

contador.textContent = cantidad + (cantidad === 1 ? " juego disponible" : " juegos disponibles");
ordenarProductos();
}

function ordenarProductos() {
const tarjetas = [...productos];

if(ordenar.value === "name") {
tarjetas.sort((a,b) => a.querySelector(".product-card__title").textContent.localeCompare(b.querySelector(".product-card__title").textContent));
}

if(ordenar.value === "price-low" || ordenar.value === "price-high") {
tarjetas.sort((a,b) => {
const precioA = parseInt(a.querySelector(".product-card__price").textContent.replace(/\D/g, ""));
const precioB = parseInt(b.querySelector(".product-card__price").textContent.replace(/\D/g, ""));
return ordenar.value === "price-low" ? precioA - precioB : precioB - precioA;
});
}

tarjetas.forEach(tarjeta => catalogo.appendChild(tarjeta));
}

formulario.addEventListener("change", filtrar);
formulario.addEventListener("reset", () => setTimeout(filtrar, 10));
buscador.addEventListener("input", filtrar);
buscador.closest("form").addEventListener("submit", e => {
e.preventDefault();
filtrar();
});
ordenar.addEventListener("change", filtrar);

filtrar();
});