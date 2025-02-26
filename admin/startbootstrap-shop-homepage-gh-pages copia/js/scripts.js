/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

console.log("ciao");

const Bearer = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2JjZGZlZmU3MDMzNzAwMTUzMTZkZDciLCJpYXQiOjE3NDA0MzEzNDMsImV4cCI6MTc0MTY0MDk0M30.QIyekhCPalK1m0FoSXHF1V-w-UXkY8UItLTZO1O5APs";

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
        })
        .catch(error => console.error("Errore nella fetch:", error));
};

// Esegui fetch quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", fetchData);
