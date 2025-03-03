
// input di ricerca
const searchInput = document.getElementById("searchInput")


//console.log("Caricamento pagina prodotto...");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

// Funzione per ottenere l'ID del prodotto dall'URL
const getProductIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id"); // Restituisce l'ID se presente, altrimenti null
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
       // console.log("Prodotto ricevuto:", product);
        populateForm(product);
        
    })
    .catch(error => console.error("Errore:", error));
};

// Funzione per riempire il form con i dati del prodotto
const populateForm = (product) => {
    document.getElementById("inputEmail4").value = product.name || "";
    document.getElementById("exampleFormControlTextarea1").value = product.description || "";
    document.getElementById("inputAddress").value = product.brand || "";
    document.getElementById("inputAddress2").value = product.imageUrl || "";
    document.getElementById("inputCity").value = product.price || "";

    // Cambia il titolo e il bottone
    document.getElementById("formTitle").textContent = "Modifica Prodotto";
    document.getElementById("submit-btn").textContent = "Salva Modifiche";
};

// Funzione per inviare i dati (POST per creazione, PUT per modifica)
const handleFormSubmit = (event) => {
  event.preventDefault(); // Evita il refresh della pagina

  const productId = getProductIdFromUrl();
  const isEditing = productId !== null;

  const formData = {
      name: document.getElementById("inputEmail4").value.trim(),
      description: document.getElementById("exampleFormControlTextarea1").value.trim(),
      brand: document.getElementById("inputAddress").value.trim(),
      imageUrl: document.getElementById("inputAddress2").value.trim(),
      price: document.getElementById("inputCity").value.trim()
  };

  // Controlla se tutti i campi sono compilati
  if (!formData.name || !formData.description || !formData.brand || !formData.imageUrl || !formData.price) {
      setTimeout(() => {
        
          alert("Compila tutti i campi prima di creare/modificare un prodotto!");
      }, 1000); // Mostra l'alert dopo 2 secondi
      return;
  }
  

  // Assicura che il prezzo sia un numero
  formData.price = parseFloat(formData.price);
  if (isNaN(formData.price)) {
      setTimeout(() => {
          alert("Inserisci un valore numerico valido per il prezzo!");
      }, 2000);
      return;
  }

  //console.log("Dati inviati:", formData);

  const myHeaders = new Headers();
  myHeaders.append("Authorization", Bearer);
  myHeaders.append("Content-Type", "application/json");

  //operarotre ternario se is editing è vero allora la stranga sarà la prima condizione ? se è vero altrimenti la condizione sarà :
  const endpoint = isEditing 
      ? `https://striveschool-api.herokuapp.com/api/product/${productId}` 
      : "https://striveschool-api.herokuapp.com/api/product/";
  
  const method = isEditing ? "PUT" : "POST";

  fetch(endpoint, {
      method: method,
      headers: myHeaders,
      body: JSON.stringify(formData),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error(`Errore nella ${isEditing ? 'modifica' : 'creazione'} del prodotto`);
      }
      return response.json();
  })
  .then((result) => {
     // console.log(`Prodotto ${isEditing ? 'modificato' : 'creato'}:`, result);
      alert(` Prodotto ${isEditing ? 'aggiornato' : 'creato'} con successo!`);
      window.location.href = "/admin/table.html"; // Reindirizza alla lista dei prodotti
  })
  .catch((error) => console.error(error));
};

// Quando la pagina è caricata, controlla se deve modificare o creare un prodotto
document.addEventListener("DOMContentLoaded", () => {
    const productId = getProductIdFromUrl();
    if (productId) {
        fetchProductById(productId); // Se c'è un ID, carica i dati per modificarli
    }

    // Aggiunge l'evento submit al form
    document.getElementById("productForm").addEventListener("submit", handleFormSubmit);
});


