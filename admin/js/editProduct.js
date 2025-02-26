console.log("Caricamento pagina di modifica...");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Funzione per ottenere l'ID del prodotto dall'URL
const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Restituisce l'ID del prodotto
};

// Funzione per ottenere i dettagli del prodotto dall'API e popolare il form
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
        console.log("Prodotto ricevuto:", product);
        populateForm(product);
    })
    .catch(error => console.error("Errore:", error));
};

// Funzione per popolare il form con i dati del prodotto
const populateForm = (product) => {
    document.getElementById("name").value = product.name;
    document.getElementById("description").value = product.description;
    document.getElementById("brand").value = product.brand;
    document.getElementById("imageUrl").value = product.imageUrl;
    document.getElementById("price").value = product.price;
};

// Funzione per inviare i dati aggiornati del prodotto all'API  
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
        console.log("Prodotto aggiornato:", updatedData);
        alert("Prodotto aggiornato con successo!"); // Mostra un messaggio di conferma
        window.location.href = "tables.html"; // Reindirizza alla lista dei prodotti dopo la modifica
    })
    .catch(error => console.error("Errore:", error));
};

// Quando la pagina è caricata, recupera i dettagli del prodotto
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
