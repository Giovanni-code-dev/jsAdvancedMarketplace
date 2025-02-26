// Variabile globale per salvare tutti i prodotti
let allProducts = [];

// input di ricerca
const searchInput = document.getElementById("searchInput");

console.log("ciao");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Seleziona il tbody della tabella
const outputElement = document.getElementById("output");

// Funzione per caricare i dati dalla API
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
            console.log("Dati ricevuti:", data);

            // Salva i dati nella variabile globale
            allProducts = data;

            // Renderizza i prodotti nella tabella
            renderProducts(allProducts);
        })
        .catch(error => console.error("Errore:", error));
};

// Funzione per renderizzare i prodotti nella tabella
function renderProducts(products) {
    if (!outputElement) {
        console.error("Elemento con ID 'output' non trovato nel DOM.");
        return;
    }

    // Svuota la tabella prima di renderizzare i nuovi dati
    outputElement.innerHTML = "";

    const elements = products.map(({ _id, name, description, brand, imageUrl, price }) => {
        const tr = document.createElement("tr");
        tr.dataset.id = _id;

        // Colonna azioni
        const actionTd = document.createElement("td");
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "d-flex justify-content-between align-items-center w-100 gap-2 h-100";

        // Bottone Modifica
        const editButton = document.createElement("button");
        editButton.className = "btn btn-info btn-sm d-flex justify-content-center align-items-center edit-button";
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

        const descriptionTd = document.createElement("td");
        descriptionTd.textContent = description;

        const brandTd = document.createElement("td");
        brandTd.textContent = brand;

        const imageTd = document.createElement("td");
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = name;
        img.width = 100;
        imageTd.appendChild(img);

        const idTd = document.createElement("td");
        idTd.textContent = _id;

        const priceTd = document.createElement("td");
        priceTd.textContent = `${price} €`;

        tr.append(actionTd, nameTd, descriptionTd, brandTd, imageTd, idTd, priceTd);

        return tr;
    });

    // Aggiunge tutte le righe alla tabella
    outputElement.append(...elements);

    // Aggiunge gli event listener ai bottoni
    attachDeleteEventListeners();
    attachEditEventListeners();
}

// Funzione per eliminare un prodotto con una richiesta DELETE
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
        console.log(`Prodotto con ID ${id} eliminato`);

        // Aggiorna la variabile globale rimuovendo il prodotto eliminato
        allProducts = allProducts.filter(product => product._id !== id);

        // Ricarica la lista aggiornata
        renderProducts(allProducts);
    })
    .catch(error => console.error("Errore:", error));
};

// Funzione per aggiungere event listener ai bottoni delete
const attachDeleteEventListeners = () => {
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.currentTarget.dataset.id;
            deleteProduct(productId);
        });
    });
};

// Funzione per aggiungere event listener ai bottoni edit
const attachEditEventListeners = () => {
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.currentTarget.dataset.id;
            window.location.href = `product.html?id=${productId}`;
        });
    });
};


// Funzione per filtrare i prodotti in base al valore di searchInput
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();

    // Se l'utente ha digitato meno di 3 caratteri, mostra tutti i prodotti
    if (searchTerm.length < 3) {
        renderProducts(allProducts);
        return;
    }

    // Filtra i prodotti controllando se il termine è presente in nome, descrizione o brand
    const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );

    // Aggiorna la tabella con i risultati filtrati
    renderProducts(filtered);
}

// Event Listener per filtrare in tempo reale
searchInput.addEventListener("input", filterProducts);

// Esegui fetch quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", fetchData);
