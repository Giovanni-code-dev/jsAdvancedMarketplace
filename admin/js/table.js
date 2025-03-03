// Variabile globale per salvare tutti i prodotti
let allProducts = [];
let order = 0;
let orderBy = "";

// Selezioniamo l’input di ricerca con id="searchInput"
const searchInput = document.getElementById("searchInput");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Seleziona il tbody della tabella
const outputElement = document.getElementById("output");

/*********************************************
 * FUNZIONE: fetchData
 * SCOPO: CARICARE I DATI DALL'API E ORDINARLI,
 *        SUCCESSIVAMENTE RENDERIZZARLI IN TABELLA
 *********************************************/
const fetchData = () => {
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
            //console.log("Dati ricevuti:", data);

            // Salva i dati nella variabile globale
            allProducts = data;

            // Proviamo a ordinare i dati in base al nome
            let reorderData = data.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));

            // Gestione ordinamento sulle colonne (cliccando sull’intestazione)
            document.querySelectorAll("th").forEach(th => {
                th.addEventListener("click", () => {
                    const sorKey = th.dataset.sort;
                    if (sorKey && sorKey === "name") {
                        if (order === 0) {
                            reorderData = data.sort((b, a) => a.name.trim().localeCompare(b.name.trim()));
                            order++;
                        } else {
                            reorderData = data.sort((a, b) => a.name.trim().localeCompare(b.name.trim()));
                            order = 0;
                        }
                    }

                    if (sorKey && sorKey === "brand") {
                        if (order === 0) {
                            reorderData = data.sort((b, a) => a.brand.trim().localeCompare(b.brand.trim()));
                            order++;
                        } else {
                            reorderData = data.sort((a, b) => a.brand.trim().localeCompare(b.brand.trim()));
                            order = 0;
                        }
                    }

                    if (sorKey && sorKey === "price") {
                        if (order === 0) {
                            reorderData = data.sort((b, a) => a.price - b.price);
                            order++;
                        } else {
                            reorderData = data.sort((a, b) => a.price - b.price);
                            order = 0;
                        }
                    }
                    renderProducts(reorderData, outputElement);
                });
            });

            // Renderizza i prodotti nella tabella iniziale
            renderProducts(reorderData, outputElement);
        })
        .catch(error => console.error("Errore:", error));
};

/*********************************************
 * FUNZIONE: renderProducts
 * SCOPO: RENDERIZZARE I PRODOTTI NELLA TABELLA
 *********************************************/
function renderProducts(products, outputElement) {
    if (!outputElement) {
        console.error("Elemento con ID 'output' non trovato nel DOM.");
        return;
    }

    // Svuota la tabella prima di renderizzare i nuovi dati
    outputElement.innerHTML = "";

    const elements = products.map(({ _id, name, brand, imageUrl, price }) => {
        const tr = document.createElement("tr");
        tr.dataset.id = _id;

        // Colonna azioni
        const actionTd = document.createElement("td");
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-between align-items-center w-100 gap-2 h-100";

        // Bottone Modifica
        const editButton = document.createElement("button");
        editButton.className = "btn btn-secondary btn-sm d-flex justify-content-center align-items-center edit-button";
        editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
        editButton.dataset.id = _id;

        // Bottone Elimina
        const deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger btn-sm d-flex justify-content-center align-items-center delete-button";
        deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
        deleteButton.dataset.id = _id;

        // Aggiunge i bottoni al container e alla cella
        buttonContainer.append(editButton, deleteButton);
        actionTd.appendChild(buttonContainer);
        tr.appendChild(actionTd);

        // Creazione delle altre colonne
        const nameTd = document.createElement("td");
        nameTd.textContent = name;

        const brandTd = document.createElement("td");
        brandTd.textContent = brand;

        const imageTd = document.createElement("td");
        const img = document.createElement("img");

        img.src = imageUrl;
        img.alt = name;
        img.className = "img-fluid  rounded";
        img.style.width = "100px";
        imageTd.appendChild(img);

        const priceTd = document.createElement("td");
        priceTd.textContent = `${price} €`;

        tr.append(nameTd, brandTd, imageTd, priceTd, actionTd);
        return tr;
    });

    // Aggiunge tutte le righe alla tabella
    outputElement.append(...elements);

    // Aggiunge gli event listener ai bottoni
    attachDeleteEventListeners();
    attachEditEventListeners();
}

/*********************************************
 * FUNZIONE: deleteProduct
 * SCOPO: ELIMINARE UN PRODOTTO CON UNA RICHIESTA DELETE
 *********************************************/
const deleteProduct = (id) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) return;

    fetch(`https://striveschool-api.herokuapp.com/api/product/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: Bearer
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Errore nell'eliminazione del prodotto");
            }
            //console.log(`Prodotto con ID ${id} eliminato`);

            // Aggiorna la variabile globale rimuovendo il prodotto eliminato
            allProducts = allProducts.filter(product => product._id !== id);

            // Ricarica la lista aggiornata
            renderProducts(allProducts, outputElement);
        })
        .catch(error => console.error("Errore:", error));
};

/*********************************************
 * FUNZIONE: attachDeleteEventListeners
 * SCOPO: AGGIUNGERE EVENT LISTENER AI BOTTONI DI ELIMINAZIONE
 *********************************************/
const attachDeleteEventListeners = () => {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.currentTarget.dataset.id;
            deleteProduct(productId);
        });
    });
};

/*********************************************
 * FUNZIONE: attachEditEventListeners
 * SCOPO: AGGIUNGERE EVENT LISTENER AI BOTTONI DI MODIFICA
 *********************************************/
const attachEditEventListeners = () => {
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.currentTarget.dataset.id;
            window.location.href = `product.html?id=${productId}`;
        });
    });
};

/*********************************************
 * FUNZIONE: filterProducts
 * SCOPO: FILTRARE I PRODOTTI IN BASE ALL’INPUT DI RICERCA
 *********************************************/
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    // Se l'utente ha digitato meno di 3 caratteri, mostra tutti i prodotti
    if (searchTerm.length < 3) {
        renderProducts(allProducts, outputElement);
        return;
    }

    // Filtra i prodotti controllando se il termine è presente in nome o brand
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );

    // Aggiorna la tabella con i risultati filtrati
    renderProducts(filtered, outputElement);
}

// Event Listener per filtrare in tempo reale
searchInput.addEventListener("input", filterProducts);

/*********************************************
 * EVENT LISTENER: DOMContentLoaded
 * SCOPO: ESEGUIRE fetchData AL CARICAMENTO DEL DOM
 *********************************************/
document.addEventListener("DOMContentLoaded", fetchData);
