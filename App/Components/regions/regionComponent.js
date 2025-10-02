import './lstRegion.js';
import './regRegion.js';

export class RegionComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/regions/regionStyle.css";
            </style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mnuregion" aria-current="page" href="#" data-verocultar='["#regRegion",["#lstRegion"]]'>Registrar Región</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mnuregion" href="#" data-verocultar='["#lstRegion",["#regRegion"]]'>Listado de Regiones</a>
                </li>
            </ul>
            <div class="container" id="regRegion" style="display:block;">
                <reg-region></reg-region>
            </div>
            <div class="container" id="lstRegion" style="display:none;">
                <lst-region></lst-region>
            </div>    
        `;
        this.querySelectorAll(".mnuregion").forEach((val, id) => {
            val.addEventListener("click", (e) => {
                let data = JSON.parse(e.target.dataset.verocultar);
                let cardVer = document.querySelector(data[0]);
                cardVer.style.display = 'block';
                data[1].forEach(card => {
                    let cardActual = document.querySelector(card);
                    cardActual.style.display = 'none';
                });

                // Recargar listado cuando se hace clic en la pestaña
                if (data[0] === '#lstRegion') {
                    const lstRegion = document.querySelector('lst-region');
                    if (lstRegion) {
                        lstRegion.loadRegions();
                    }
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            })
        });
    }
}

customElements.define('region-component', RegionComponent);