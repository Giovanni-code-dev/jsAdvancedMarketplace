console.log("ciao");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Seleziona il tbody della tabella
const outputElement = document.getElementById("output");

// Funzione per caricare i dati dalla API e renderizzarli in tabella
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

            // Controlla che l'elemento esista
            if (!outputElement) {
                console.error("Elemento con ID 'output' non trovato nel DOM.");
                return;
            }

            // Svuota la tabella prima di renderizzare i nuovi dati
            outputElement.innerHTML = "";

            const elements = data.map(({ _id, name, description, brand, imageUrl, price }) => {
                const tr = document.createElement("tr");
                tr.dataset.id = _id; // Aggiunge un attributo data-id per il riferimento

                // Colonna azioni
                const actionTd = document.createElement("td");
                const buttonContainer = document.createElement("div");
                buttonContainer.className = "d-flex justify-content-between align-items-center w-100 gap-2 h-100";

                const editButton = document.createElement("button");
                editButton.className = "btn btn-info btn-sm d-flex justify-content-center align-items-center edit-button";
                editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
                editButton.dataset.id = _id;

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger btn-sm d-flex justify-content-center align-items-center delete-button";
                deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
                deleteButton.dataset.id = _id;

                // Aggiunge i bottoni al container e alla cella
                buttonContainer.append(editButton, deleteButton);
                actionTd.appendChild(buttonContainer);
                tr.appendChild(actionTd);

                // Creazione delle altre colonne dinamiche
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
                img.width = 50;
                imageTd.appendChild(img);

                const idTd = document.createElement("td");
                idTd.textContent = _id;

                const priceTd = document.createElement("td");
                priceTd.textContent = `${price} €`;

                // Aggiunge le celle alla riga
                tr.append(actionTd, nameTd, descriptionTd, brandTd, imageTd, idTd, priceTd);

                return tr;
            });

            // Aggiunge tutte le righe alla tabella
            outputElement.append(...elements);

            // Dopo aver creato la tabella, aggiunge gli event listener ai bottoni delete ed edit
            attachDeleteEventListeners();
            attachEditEventListeners();
        })
        .catch(error => console.error("Errore:", error));
};

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
        // Dopo l'eliminazione, ricarica la lista aggiornata
        fetchData();
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

// Esegui fetch quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", fetchData);
