/*!
 * GESTIONE DI UN PRODOTTO (EDITING) - SCRIPT JS
 * Utilizza la StriveSchool API per recuperare e aggiornare i dati di un singolo prodotto
 */

// Variabile Bearer Key
const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

/*********************************************
 * FUNZIONE: getProductIdFromUrl
 * SCOPO: OTTENERE L'ID DEL PRODOTTO DALL'URL
 *********************************************/
const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Restituisce l'ID del prodotto
};

/*********************************************
 * FUNZIONE: fetchProductById
 * SCOPO: OTTENERE I DETTAGLI DEL PRODOTTO DALL'API 
 *        E POPOLARE IL FORM
 *********************************************/
const fetchProductById = (id) => {
    fetch(`https://striveschool-api.herokuapp.com/api/product/${id}`, {
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
    .then(product => {
        //console.log("Prodotto ricevuto:", product);
        populateForm(product);
    })
    .catch(error => console.error("Errore:", error));
};

/*********************************************
 * FUNZIONE: populateForm
 * SCOPO: POPOLARE IL FORM CON I DATI DEL PRODOTTO
 *********************************************/
const populateForm = (product) => {
    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("brand").value = product.brand;
    document.getElementById("imageUrl").value = product.imageUrl;
    document.getElementById("price").value = product.price;
};

/*********************************************
 * FUNZIONE: updateProduct
 * SCOPO: INVIARE I DATI AGGIORNATI DEL PRODOTTO ALL'API
 *********************************************/
const updateProduct = (event) => {
    event.preventDefault(); // Evita il refresh della pagina

    const productId = getProductIdFromUrl();
    if (!productId) {
        console.error("Nessun ID prodotto trovato nell'URL.");
        return;
    }

    // Creazione dell'oggetto con i dati aggiornati
    const updatedProduct = {
        name: document.getElementById("name").value,
        description: document.getElementById("description").value,
        brand: document.getElementById("brand").value,
        imageUrl: document.getElementById("imageUrl").value,
        price: parseFloat(document.getElementById("price").value) // Converte il prezzo in numero
    };

    fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: Bearer
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Errore nell'aggiornamento del prodotto");
        }
        return response.json();
    })
    .then(updatedData => {
        //console.log("Prodotto aggiornato:", updatedData);
        alert("Prodotto aggiornato con successo!"); // Mostra un messaggio di conferma
        window.location.href = "tables.html"; // Reindirizza alla lista dei prodotti dopo la modifica
    })
    .catch(error => console.error("Errore:", error));
};

/*********************************************
 * EVENT LISTENER: DOMContentLoaded
 * SCOPO: AL CARICAMENTO DEL DOM, RECUPERARE I DETTAGLI DEL PRODOTTO
 *        E AGGIUNGERE L'EVENTO DI SUBMIT AL FORM
 *********************************************/
document.addEventListener("DOMContentLoaded", () => {
    const productId = getProductIdFromUrl();
    if (productId) {
        fetchProductById(productId);
    } else {
        console.error("Nessun ID prodotto trovato nell'URL.");
    }

    // Aggiunge l'evento submit al form
    document.getElementById("editProductForm").addEventListener("submit", updateProduct);
});
