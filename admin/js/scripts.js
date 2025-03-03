/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

// Seleziona il contenitore della griglia dei prodotti sulla frontpage
const productsContainer = document.getElementById("productsContainer");

// Variabile globale per salvare tutti i prodotti sulla frontpage
let allProductsFrontpage = [];

// Bearer key
const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Funzione per mescolare casualmente un array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    let shuffledArray = [...array]; // Creiamo una copia per non modificare l'originale
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Generiamo un indice casuale
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Scambio
    }
    return shuffledArray;
}

// Funzione asincrona per caricare i dati dalla API e restituire l'array mescolato
async function fetchFrontpageData() {
    const options = {
        headers: {
            Authorization: Bearer
        }
    };

    try {
        const response = await fetch("https://striveschool-api.herokuapp.com/api/product/", options);
        if (!response.ok) {
            throw new Error("Errore nel caricamento dei dati");
        }

        const data = await response.json();

       // console.log("Dati ricevuti sulla frontPage:", data);

        // Mescoliamo i prodotti prima di restituirli
        return shuffleArray(data);
    } catch (error) {
        console.error("Errore:", error);
        return []; // Ritorniamo un array vuoto in caso di errore
    }
};

// Funzione per renderizzare i prodotti sulla frontpage
function renderFrontpageProducts(arlecchino) {
    if (!productsContainer) {
        console.error("Elemento con ID 'productsContainer' non trovato nel DOM.");
        return;
    }

    // Svuota il contenitore prima di renderizzare i nuovi prodotti
    productsContainer.innerHTML = "";

    const elements = arlecchino.map(({ _id, name, brand, imageUrl, price }) => {
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
        
        // Applica un'animazione quando l'immagine viene aggiunta con gsap
        img.onload = () => {
            gsap.from(img, {
                opacity: 0,
                scale: 0.8,
                y: 50, 
                duration: 1.5,
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
        viewButton.href = `/admin/detailProduct.html?id=${_id}`; // Link alla pagina dettagli del prodotto
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

// in attesa che tutto il DOM si carici impostiamo attesa per renderizzare i prodotti dopo la fetch
document.addEventListener("DOMContentLoaded", async () => {
    const spinner = document.getElementById("loadingSpinner");
    const productsContainer = document.getElementById("productsContainer");

    spinner.style.display = "block";
    productsContainer.style.display = "none";

    // Aspettiamo il risultato della fetch e della mescolata
    allProductsFrontpage = await fetchFrontpageData();

    // Aspettiamo 2 secondi prima di renderizzare (solo se i dati sono stati ricevuti)
    setTimeout(() => {
        renderFrontpageProducts(allProductsFrontpage);

        // Nasconde lo spinner e mostra i prodotti
        spinner.style.display = "none";
        productsContainer.style.display = "flex";
    }, 500);
});

