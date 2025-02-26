/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project


const bookContainer = document.getElementById("bookContainer");

        // Funzione per effettuare la chiamata GET all'API
        async function fetchBooks() {
            try {
                const response = await fetch("https://example.com/api/books"); // Sostituisci con il vero endpoint
                if (!response.ok) throw new Error("Errore nella richiesta API");
                const books = await response.json();
                renderBooks(books);
            } catch (error) {
                console.error("Errore:", error);
            }
        }

        // Funzione per generare le card dei libri
        function renderBooks(books) {
            bookContainer.innerHTML = "";

            books.forEach(book => {
                const col = document.createElement("div");
                col.className = "col-lg-3 col-md-4 p-2";

                const card = document.createElement("div");
                card.className = "card shadow-lg position-relative overflow-hidden";

                const img = document.createElement("img");
                img.src = book.img;
                img.alt = book.title;
                img.className = "card-img-top img-fluid";

                const cardBody = document.createElement("div");
                cardBody.className = "card-body text-center";

                const title = document.createElement("h5");
                title.className = "fw-bolder";
                title.textContent = book.title;

                const price = document.createElement("p");
                price.textContent = `$${book.price}`;

                const buttonContainer = document.createElement("div");
                buttonContainer.className = "d-flex justify-content-evenly align-items-center gap-2";

                const detailsButton = document.createElement("button");
                detailsButton.className = "btn btn-primary";
                detailsButton.innerHTML = '<i class="bi bi-info-circle-fill"></i>';
                detailsButton.onclick = () => window.location.href = `dettagli.html?id=${book.id}`;

                const cartButton = document.createElement("button");
                cartButton.className = "btn btn-success";
                cartButton.innerHTML = '<i class="bi bi-cart-fill"></i>';
                cartButton.onclick = () => alert(`Added "${book.title}" to cart!`);

                const dismissButton = document.createElement("button");
                dismissButton.className = "btn btn-danger";
                dismissButton.innerHTML = '<i class="bi bi-x-circle-fill"></i>';
                dismissButton.onclick = () => col.remove();

                buttonContainer.append(detailsButton, cartButton, dismissButton);
                cardBody.append(title, price, buttonContainer);
                card.append(img, cardBody);
                col.append(card);
                bookContainer.append(col);
            });
        }

        // Chiamata API al caricamento della pagina
        fetchBooks();