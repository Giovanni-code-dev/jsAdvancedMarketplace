/*!
* Start Bootstrap - Shop Item v5.0.6 (https://startbootstrap.com/template/shop-item)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-item/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


// Variabile globale per salvare i dati del singolo prodotto
let selectedProduct = {};

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";




// Funzione per ottenere l'ID del prodotto dall'URL
const getProductIdFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
};

// Funzione per caricare i dati del singolo prodotto
const fetchProductDetails = () => {
    const productId = getProductIdFromURL();
    
    if (!productId) {
        console.error("ID prodotto non trovato nell'URL.");
        return;
    }

    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        headers: {
            Authorization: Bearer
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nel caricamento del prodotto");
        }
        return response.json();
    })
    .then(data => {
        console.log("Dati del prodotto:", data);
        
        // Salva i dati nella variabile globale
        selectedProduct = data;
    })
    .catch(error => console.error("Errore:", error));
};


// Seleziona il contenitore dei dettagli del prodotto
const productDetailsContainer = document.getElementById("productDetailsContainer");

// Funzione per renderizzare i dettagli del prodotto
function renderProductDetails(product) {
    if (!productDetailsContainer) {
        console.error("Elemento con ID 'productDetailsContainer' non trovato nel DOM.");
        return;
    }

    // Svuota il contenitore prima di renderizzare i nuovi dettagli
    productDetailsContainer.innerHTML = "";

    // Creazione del contenitore principale (row)
    const rowDiv = document.createElement("div");
    rowDiv.className = "row gx-4 gx-lg-5 align-items-center";

    // Colonna Immagine
    const colImageDiv = document.createElement("div");
    colImageDiv.className = "col-md-6";

    const img = document.createElement("img");
    img.className = "card-img-top mb-5 mb-md-0";
    img.src = product.imageUrl;
    img.alt = product.name;

    // Assicurati che l'immagine sia caricata prima di applicare GSAP
    img.onload = () => {
        console.log("Immagine caricata, applico l'effetto hover con GSAP!");

        img.addEventListener("mouseenter", () => {
            gsap.to(img, { 
                scale: 1.1, 
                duration: 0.3, 
                ease: "power1.out"
            });
        });

        img.addEventListener("mouseleave", () => {
            gsap.to(img, { 
                scale: 1, 
                duration: 0.3, 
                ease: "power1.out"
            });
        });

        // Effetto di fade-in quando l'immagine appare
        gsap.from(img, { 
            opacity: 0, 
            duration: 0.8, 
            ease: "power2.out"
        });
    };

    colImageDiv.appendChild(img);

    // Colonna Descrizione
    const colDescriptionDiv = document.createElement("div");
    colDescriptionDiv.className = "col-md-6";

    const sku = document.createElement("div");
    sku.className = "small mb-1";
    sku.textContent = `ID: ${product._id}`;

    const title = document.createElement("h1");
    title.className = "display-5 fw-bolder";
    title.textContent = product.name;

    const priceContainer = document.createElement("div");
    priceContainer.className = "fs-5 mb-5";

    const priceText = document.createElement("span");
    priceText.textContent = `${product.price} €`;

    priceContainer.appendChild(priceText);

    const description = document.createElement("p");
    description.className = "lead";
    description.textContent = product.description;

    // Sezione acquisto con input quantità e bottone
    const dFlexDiv = document.createElement("div");
    dFlexDiv.className = "d-flex";

    const inputQuantity = document.createElement("input");
    inputQuantity.className = "form-control text-center me-3";
    inputQuantity.id = "inputQuantity";
    inputQuantity.type = "number";
    inputQuantity.value = "1";
    inputQuantity.min = "1";
    inputQuantity.style.maxWidth = "3rem";

    const addToCartButton = document.createElement("button");
    addToCartButton.className = "btn btn-outline-dark flex-shrink-0";
    addToCartButton.type = "button";
    addToCartButton.innerHTML = `<i class="bi-cart-fill me-1"></i> Aggiungi al carrello`;

    dFlexDiv.append(inputQuantity, addToCartButton);
    colDescriptionDiv.append(sku, title, priceContainer, description, dFlexDiv);

    // Assemblaggio finale
    rowDiv.append(colImageDiv, colDescriptionDiv);
    productDetailsContainer.appendChild(rowDiv);
}


// Dopo la fetch, renderizza i dettagli del prodotto
document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById("loadingSpinner");
    const productContainer = document.getElementById("productDetailsContainer");




    // Mostra lo spinner e nasconde i dettagli del prodotto
    spinner.style.display = "block";
    productContainer.style.display = "none";

    fetchProductDetails(); // Recupera i dati

    setTimeout(() => {
        renderProductDetails(selectedProduct);

        // Dopo il caricamento, nasconde lo spinner e mostra i dettagli
        spinner.style.display = "none";
        productContainer.style.display = "flex";
    }, 2000); // Aspetta la fetch prima di mostrare il contenuto
});

// Esegui fetch quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", fetchProductDetails);



