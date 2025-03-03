/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// Questo file è intenzionalmente vuoto
// Utilizza questo file per aggiungere JavaScript al tuo progetto

// Seleziona il contenitore della griglia dei prodotti sulla frontpage
const productsContainer = document.getElementById("productsContainer");

const cartCount = document.getElementById("cartCount");

let cartItemsArray = []; // Array del carrello

// Variabile globale per salvare tutti i prodotti sulla frontpage
let allProductsFrontpage = [];

// Bearer key
const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

/*********************************************
 * FUNZIONE: shuffleArray
 * SCOPO: MESCOLA CASUALMENTE GLI ELEMENTI DI UN ARRAY
 *********************************************/
function shuffleArray(array) {
    let shuffledArray = [...array]; // Creiamo una copia per non modificare l'originale
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Generiamo un indice casuale
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Scambio
    }
    return shuffledArray;
}

/*********************************************
 * FUNZIONE: fetchFrontpageData
 * SCOPO: EFFETTUA UNA RICHIESTA ALL’API E RESTITUISCE
 *        I PRODOTTI MESCOLATI
 *********************************************/
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

        // Mescoliamo i prodotti prima di restituirli
        return shuffleArray(data);
    } catch (error) {
        console.error("Errore:", error);
        return []; // Ritorniamo un array vuoto in caso di errore
    }
}

/*********************************************
 * FUNZIONE: renderFrontpageProducts
 * SCOPO: RENDERIZZA SULLA PAGINA L’ELENCO DEI PRODOTTI
 *********************************************/
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

/*********************************************
 * EVENT LISTENER: DOMContentLoaded
 * SCOPO: ESEGUE IL CODICE DOPO IL CARICAMENTO DEL DOM
 *********************************************/
document.addEventListener("DOMContentLoaded", async () => {
    // 1. Carichi i dati del carrello da localStorage
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      cartItemsArray = JSON.parse(savedCart);
      updateCartCount(); 
    }

    // 2. Mostri spinner e nascondi container
    const spinner = document.getElementById("loadingSpinner");
    const productsContainer = document.getElementById("productsContainer");
    spinner.style.display = "block";
    productsContainer.style.display = "none";

    // 3. Fai la fetch e salvi i risultati
    allProductsFrontpage = await fetchFrontpageData();

    // 4. Renderizzi dopo un piccolo timeout
    setTimeout(() => {
      renderFrontpageProducts(allProductsFrontpage);
      spinner.style.display = "none";
      productsContainer.style.display = "flex";
    }, 500);
});

/*********************************************
 * FUNZIONE: updateCartCount
 * SCOPO: AGGIORNA IL CONTATORE DEGLI ARTICOLI NEL CARRELLO
 *********************************************/
function updateCartCount() {
    cartCount.textContent = cartItemsArray.length;
}
