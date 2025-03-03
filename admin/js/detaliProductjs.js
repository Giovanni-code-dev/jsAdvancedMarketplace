/*!
    * Start Bootstrap - Shop Item v5.0.6 (https://startbootstrap.com/template/shop-item)
    * Copyright 2013-2023 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-item/blob/master/LICENSE)
    */
    // This file is intentionally blank
    // Use this file to add JavaScript to your project

    // Variabile globale per salvare i dati del singolo prodotto
    let selectedProduct = {};
    let allProducts = [];
    let sameBrandProducts = []; // Prodotti dello stesso brand
    let cartItemsArray = [];    // Array del carrello

    // Riferimenti agli elementi della pagina
    const cartButtonShow = document.getElementById("cartButtonShow");
    const cartCount = document.getElementById("cartCount");
    const productDetailsContainer = document.getElementById("productDetailsContainer");
    const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

    // Funzione per ottenere l'ID del prodotto dall'URL
    function getProductIdFromURL() {
      const params = new URLSearchParams(window.location.search);
      return params.get("id");
    }

    // Funzione asincrona per caricare i dati di tutti i prodotti
    async function fetchAllProducts() {
      try {
        const response = await fetch("https://striveschool-api.herokuapp.com/api/product/", {
          headers: {
            Authorization: Bearer
          }
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento dei prodotti");
        }

        const data = await response.json();
        //console.log("Dati di tutti i prodotti:", data);

        // Salva i dati nella variabile globale
        allProducts = data;
        return allProducts; 
      } catch (error) {
        console.error("Errore nel caricamento dei prodotti:", error);
        return []; 
      }
    }

    // Funzione asincrona per caricare i dati del singolo prodotto
    async function fetchProductDetails() {
      const productId = getProductIdFromURL();
      if (!productId) {
        console.error("ID prodotto non trovato nell'URL.");
        return;
      }

      try {
        const response = await fetch(`https://striveschool-api.herokuapp.com/api/product/${productId}`, {
          headers: {
            Authorization: Bearer
          }
        });

        if (!response.ok) {
          throw new Error("Errore nel caricamento del prodotto");
        }

        const data = await response.json();
        //console.log("Dati del prodotto:", data);

        // Salva i dati nella variabile globale
        selectedProduct = data;
        return data; 
      } catch (error) {
        console.error("Errore:", error);
        return null; 
      }
    }

    // Funzione per renderizzare i dettagli del prodotto
    function renderProductDetails(product) {
      if (!productDetailsContainer) {
        console.error("Elemento con ID 'productDetailsContainer' non trovato nel DOM.");
        return;
      }
      // Svuota il contenitore prima di renderizzare i nuovi dettagli
      productDetailsContainer.innerHTML = "";

      // Creazione del contenitore principale (row)
      const rowDiv = document.createElement("div");
      rowDiv.className = "row gx-4 gx-lg-5 align-items-center";

      // Colonna Immagine
      const colImageDiv = document.createElement("div");
      colImageDiv.className = "col-md-6";

      const imgWrapper = document.createElement("div");
      imgWrapper.style.overflow = "hidden";
      imgWrapper.style.position = "relative";
      imgWrapper.style.width = "400px";
      imgWrapper.style.height = "475px";
      imgWrapper.className = "img-fluid ";

      const img = document.createElement("img");
      img.className = "card-img-top mb-5 mb-md-0";
      img.src = product.imageUrl;
      img.alt = product.name;

      // Zoom direzionale con GSAP
      img.style.width = "100%";  
      img.style.height = "100%";  
      img.style.objectFit = "cover"; 
      img.style.position = "absolute"; 
      img.style.top = "0";
      img.style.left = "0";
      img.style.transformOrigin = "center center";

      img.onload = () => {
        //console.log("Immagine caricata, applico l'effetto hover con GSAP!");
        img.addEventListener("mouseenter", () => {
          gsap.to(img, { 
            scale: 1.5,
            duration: 0.3, 
            ease: "power1.out"
          });
        });

        img.addEventListener("mouseleave", () => {
          gsap.to(img, { 
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.3, 
            ease: "power1.out"
          });
        });

        img.addEventListener("mousemove", (e) => {
          const boundingBox = imgWrapper.getBoundingClientRect();
          const offsetX = (e.clientX - boundingBox.left) / boundingBox.width; 
          const offsetY = (e.clientY - boundingBox.top) / boundingBox.height;

          const moveX = (offsetX - 0.5) * 50;
          const moveY = (offsetY - 0.5) * 50;

          gsap.to(img, {
            x: moveX,
            y: moveY,
            duration: 0.1
          });
        });

        /*
        // Effetto di fade-in
        gsap.from(img, { 
          opacity: 0, 
          duration: 0.8, 
          ease: "power2.out"
        });
        */

      };

      // Appendiamo l'immagine dentro il wrapper
      imgWrapper.appendChild(img);
      // Appendiamo il wrapper al contenitore dell'immagine
      colImageDiv.appendChild(imgWrapper);

      // Colonna Descrizione
      const colDescriptionDiv = document.createElement("div");
      colDescriptionDiv.className = "col-md-6";

      const sku = document.createElement("div");
      sku.className = "small mb-1";
      sku.textContent = `BRAND: ${product.brand}`;

      const title = document.createElement("h1");
      title.className = "display-5 fw-bolder";
      title.textContent = product.name;

      const priceContainer = document.createElement("div");
      priceContainer.className = "fs-5 mb-5";

      const priceText = document.createElement("span");
      priceText.textContent = `${product.price} €`;
      priceContainer.appendChild(priceText);

      const description = document.createElement("p");
      description.className = "lead";
      description.textContent = product.description;

      // Sezione acquisto con input quantità e bottone
      const dFlexDiv = document.createElement("div");
      dFlexDiv.className = "d-flex";

      const inputQuantity = document.createElement("input");
      inputQuantity.className = "form-control text-center me-3";
      inputQuantity.id = "inputQuantity";
      inputQuantity.type = "number";
      inputQuantity.value = "1";
      inputQuantity.min = "1";
      inputQuantity.style.maxWidth = "3rem";

      const addToCartButton = document.createElement("button");
      addToCartButton.className = "btn btn-outline-dark flex-shrink-0";
      addToCartButton.id = "addToCartButton";
      addToCartButton.type = "button";
      addToCartButton.innerHTML = `<i class="bi-cart-fill me-1"></i> Aggiungi al carrello`;

      dFlexDiv.append(inputQuantity, addToCartButton);
      colDescriptionDiv.append(sku, title, priceContainer, description, dFlexDiv);

      // Assemblaggio finale
      rowDiv.append(colImageDiv, colDescriptionDiv);
      productDetailsContainer.appendChild(rowDiv);
    }

    // Filtrare allProducts in base al brand
    function filterProductsByBrand(brand) {
      if (!allProducts.length) {
        console.warn("Attenzione: Nessun prodotto caricato in allProducts.");
        return [];
      }
      return allProducts.filter(product => { 
       return product.brand === brand && product._id !== selectedProduct._id
      });
    }

    // Salva i prodotti dello stesso brand
    function saveProductsBySameBrand() {
      if (!selectedProduct || !selectedProduct.brand) {
        console.warn("Brand non disponibile per il prodotto selezionato.");
        return;
      }
      sameBrandProducts = filterProductsByBrand(selectedProduct.brand);
      //console.log(`Prodotti dello stesso brand (${selectedProduct.brand}):`, sameBrandProducts);
    }

    // Renderizza i prodotti dello stesso brand
    function renderSameBrandProducts(products) { 
      const relatedProductsContainer = document.getElementById("relatedProductsContainer");
      if (!relatedProductsContainer) {
        console.error("Elemento con ID 'relatedProductsContainer' non trovato nel DOM.");
        return;
      }
      // Svuota il contenitore prima di renderizzare i nuovi prodotti
      relatedProductsContainer.innerHTML = "";

      // Creazione del titolo
      const title = document.createElement("h2");
      title.className = "fw-bolder mb-4";
      title.textContent = "Related products";
      relatedProductsContainer.appendChild(title);

      // Creazione della riga di prodotti
      const rowDiv = document.createElement("div");
      rowDiv.className = "row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center";


      const elements = products.map(({ _id, name, imageUrl, price }) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col mb-5";

        const cardDiv = document.createElement("div");
        cardDiv.className = "card h-100";

        const img = document.createElement("img");
        img.className = "card-img-top";
        img.src = imageUrl || "https://dummyimage.com/450x300/dee2e6/6c757d.jpg";
        img.alt = name;

        img.onload = () => {
          gsap.from(img, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "power2.out",
          });
        };

        const cardBody = document.createElement("div");
        cardBody.className = "card-body p-4";

        const textCenter = document.createElement("div");
        textCenter.className = "text-center";

        const productTitle = document.createElement("h5");
        productTitle.className = "fw-bolder";
        productTitle.textContent = name;

        const priceText = document.createElement("p");
        priceText.textContent = `${price} €`;

        textCenter.append(productTitle, priceText);
        cardBody.appendChild(textCenter);

        const cardFooter = document.createElement("div");
        cardFooter.className = "card-footer p-4 pt-0 border-top-0 bg-transparent";

        const btnContainer = document.createElement("div");
        btnContainer.className = "text-center";

        const viewButton = document.createElement("a");
        viewButton.className = "btn btn-outline-dark mt-auto";
        viewButton.href = `detailProduct.html?id=${_id}`;
        viewButton.textContent = "View options";

        btnContainer.appendChild(viewButton);
        cardFooter.appendChild(btnContainer);

        cardDiv.append(img, cardBody, cardFooter);
        colDiv.appendChild(cardDiv);

        return colDiv;
      });

      rowDiv.append(...elements);
      relatedProductsContainer.appendChild(rowDiv);
    }

    // ==============================
    //        GESTIONE CARRELLO
    // ==============================

    // Funzione per aggiungere o rimuovere un prodotto dal carrello
    function toggleCartItem(product) {
      const index = cartItemsArray.findIndex(item => item._id === product._id);
      
      
      if (index === -1) {
        // Se il prodotto non è nel carrello, lo aggiunge
        cartItemsArray.push(product);
      } else {
        // Se il prodotto è già nel carrello, lo rimuove
        cartItemsArray.splice(index, 1);
      }
      
      // Salva il nuovo stato del carrello
      saveCartToLocalStorage(cartItemsArray);
      updateCartCount();

      //console.log("Carrello aggiornato:", cartItemsArray);
    }

    // Funzione per aggiornare il contatore del carrello
    function updateCartCount() {
      cartCount.textContent = cartItemsArray.length;
    }

    // Funzione per salvare il carrello nel localStorage
    function saveCartToLocalStorage(cartItemsArray) {
      localStorage.setItem("cartItems", JSON.stringify(cartItemsArray));
    }

    // Funzione per caricare il carrello dal localStorage
    function loadCartFromLocalStorage() {
      const savedCart = localStorage.getItem("cartItems");
      if (savedCart) {
        cartItemsArray = JSON.parse(savedCart);
        updateCartCount();
      }
    }

  //DOM
    document.addEventListener("DOMContentLoaded", async () => {
      const spinner = document.getElementById("loadingSpinner");
      const productContainer = document.getElementById("productDetailsContainer");

      // Carica il carrello dal localStorage
      loadCartFromLocalStorage();
      //console.log("Carrello recuperato all'avvio:", cartItemsArray);

      // Mostra lo spinner e nasconde i dettagli del prodotto
      spinner.style.display = "block";
      productContainer.style.display = "none";

      // Carica dati
      await fetchProductDetails(); 
      await fetchAllProducts(); 
      //console.log("Dati di allProducts dopo il caricamento:", allProducts);

      // Filtra i prodotti in base al brand del prodotto selezionato
      if (selectedProduct && selectedProduct.brand) {
        const prodottiStessoBrand = filterProductsByBrand(selectedProduct.brand);
        //console.log(`Prodotti dello stesso brand (${selectedProduct.brand}):`, prodottiStessoBrand);
      } else {
        console.warn("Brand non trovato nel prodotto selezionato.");
      }

      // Piccolo timeout per simulare caricamento
      setTimeout(() => {
        renderProductDetails(selectedProduct);
        saveProductsBySameBrand();
        renderSameBrandProducts(sameBrandProducts);
        
        // Dopo il caricamento, nasconde lo spinner e mostra i dettagli
        spinner.style.display = "none";
        productContainer.style.display = "flex";

        // Aggiungere evento al pulsante "Aggiungi al carrello" dopo il rendering del prodotto
        const addToCartButton = document.getElementById("addToCartButton");
        if (addToCartButton) {
          addToCartButton.addEventListener("click", () => {
            toggleCartItem(selectedProduct);
          });
        }
      }, 500);
    });


    