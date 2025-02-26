/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

// Variabile globale per salvare tutti i prodotti sulla frontpage
let allProductsFrontpage = [];

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Funzione per caricare i dati dalla API sulla frontpage
const fetchFrontpageData = () => {
    const options = {
        headers: {
            Authorization: Bearer
        }
    };

    fetch("https://striveschool-api.herokuapp.com/api/product/", options)
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nel caricamento dei dati");
            }
            return response.json();
        })
        .then(data => {
            console.log("Dati ricevuti sulla frontpage:", data);

            // Salva i dati nella variabile globale
            allProductsFrontpage = data;
        })
        .catch(error => console.error("Errore:", error));
};



// Seleziona il contenitore della griglia dei prodotti sulla frontpage
const productsContainer = document.getElementById("productsContainer");

// Funzione per renderizzare i prodotti sulla frontpage
function renderFrontpageProducts(products) {
    if (!productsContainer) {
        console.error("Elemento con ID 'productsContainer' non trovato nel DOM.");
        return;
    }

    // Svuota il contenitore prima di renderizzare i nuovi prodotti
    productsContainer.innerHTML = "";

    const elements = products.map(({ _id, name, description, brand, imageUrl, price }) => {
        // Creazione della colonna Bootstrap
        const colDiv = document.createElement("div");
        colDiv.className = "col mb-5";

        // Creazione della card
        const cardDiv = document.createElement("div");
        cardDiv.className = "card h-100";

        // Immagine del prodotto
        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = imageUrl;
        img.alt = name;
        
        // Applica un'animazione quando l'immagine viene aggiunta con gasp 
        img.onload = () => {
            gsap.from(img, {
                opacity: 0,
                scale: 0.8,
                duration: 1,
                ease: "power2.out"
            });
        };

        // Corpo della card
        const cardBody = document.createElement("div");
        cardBody.className = "card-body p-4";

        // Testo centrato
        const textCenter = document.createElement("div");
        textCenter.className = "text-center";

        // Nome del prodotto
        const title = document.createElement("h5");
        title.className = "fw-bolder";
        title.textContent = name;

        // Prezzo del prodotto
        const priceText = document.createElement("p");
        priceText.textContent = `${price} €`;

        // Dettagli aggiuntivi (brand)
        const brandText = document.createElement("p");
        brandText.className = "text-muted";
        brandText.textContent = brand;

        // Aggiunta dei dettagli alla card
        textCenter.append(title, brandText, priceText);
        cardBody.appendChild(textCenter);

        // Footer della card con il bottone di azione
        const cardFooter = document.createElement("div");
        cardFooter.className = "card-footer p-4 pt-0 border-top-0 bg-transparent";
        
        const btnContainer = document.createElement("div");
        btnContainer.className = "text-center";

        const viewButton = document.createElement("a");
        viewButton.className = "btn btn-outline-dark mt-auto";
        viewButton.href = `detailProduct.html?id=${_id}`; // Link alla pagina dettagli del prodotto
        viewButton.textContent = "Visualizza";

        btnContainer.appendChild(viewButton);
        cardFooter.appendChild(btnContainer);

        // Assemblaggio della card
        cardDiv.append(img, cardBody, cardFooter);
        colDiv.appendChild(cardDiv);

        return colDiv;
    });

    // Aggiunge tutte le card al contenitore principale
    productsContainer.append(...elements);
}

// Dopo la fetch, renderizza i prodotti
document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById("loadingSpinner");
    const productsContainer = document.getElementById("productsContainer");

    // Mostra lo spinner e nasconde il contenitore dei prodotti
    spinner.style.display = "block";
    productsContainer.style.display = "none";

    fetchFrontpageData(); // Recupera i dati

    setTimeout(() => {
        renderFrontpageProducts(allProductsFrontpage);
        
        // Dopo il caricamento, nasconde lo spinner e mostra i prodotti
        spinner.style.display = "none";
        productsContainer.style.display = "flex";
    }, 2000); // Attendi la fetch prima di renderizzare
});

/*
// Esegui fetch quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", fetchFrontpageData);
*/