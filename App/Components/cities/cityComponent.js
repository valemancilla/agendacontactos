import './lstCity.js';
import './regCity.js';

export class CityComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/cities/cityStyle.css";
            </style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mnucity" aria-current="page" href="#" data-verocultar='["#regCity",["#lstCity"]]'>Registrar Ciudad</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mnucity" href="#" data-verocultar='["#lstCity",["#regCity"]]'>Listado de Ciudades</a>
                </li>
            </ul>
            <div class="container" id="regCity" style="display:block;">
                <reg-city></reg-city>
            </div>
            <div class="container" id="lstCity" style="display:none;">
                <lst-city></lst-city>
            </div>    
        `;
        this.querySelectorAll(".mnucity").forEach((val, id) => {
            val.addEventListener("click", (e) => {
                let data = JSON.parse(e.target.dataset.verocultar);
                let cardVer = document.querySelector(data[0]);
                cardVer.style.display = 'block';
                data[1].forEach(card => {
                    let cardActual = document.querySelector(card);
                    cardActual.style.display = 'none';
                });

                // Recargar listado cuando se hace clic en la pestaña
                if (data[0] === '#lstCity') {
                    const lstCity = document.querySelector('lst-city');
                    if (lstCity) {
                        lstCity.loadCities();
                    }
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            })
        });
    }
}

customElements.define('city-component', CityComponent);
