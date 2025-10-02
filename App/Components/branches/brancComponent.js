import './lstBranch.js';
import './regBranch.js';

export class BranchComponent extends HTMLElement {
    constructor() {
        super();
        this.render();
    }

    render() {
        this.innerHTML = /* html */ `
            <style rel="stylesheet">
                @import "./App/Components/branches/branchStyle.css";
            </style>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active mnubranch" aria-current="page" href="#" data-verocultar='["#regBranch",["#lstBranch"]]'>Registrar Sucursal</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link mnubranch" href="#" data-verocultar='["#lstBranch",["#regBranch"]]'>Listado de Sucursales</a>
                </li>
            </ul>
            <div class="container" id="regBranch" style="display:block;">
                <reg-branch></reg-branch>
            </div>
            <div class="container" id="lstBranch" style="display:none;">
                <lst-branch></lst-branch>
            </div>    
        `;
        this.querySelectorAll(".mnubranch").forEach((val, id) => {
            val.addEventListener("click", (e) => {
                let data = JSON.parse(e.target.dataset.verocultar);
                let cardVer = document.querySelector(data[0]);
                cardVer.style.display = 'block';
                data[1].forEach(card => {
                    let cardActual = document.querySelector(card);
                    cardActual.style.display = 'none';
                });

                // Recargar listado cuando se hace clic en la pestaña
                if (data[0] === '#lstBranch') {
                    const lstBranch = document.querySelector('lst-branch');
                    if (lstBranch) {
                        lstBranch.loadBranches();
                    }
                }

                e.stopImmediatePropagation();
                e.preventDefault();
            })
        });
    }
}

customElements.define('branch-component', BranchComponent);
