import { getRegions, deleteRegions } from '../../../Apis/region/regionApi.js';

export class LstRegion extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Regiones</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Country ID</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaRegions">
                            <tr><td colspan="4" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las regiones
        this.loadRegions();
    }

    async loadRegions() {
        const regions = await getRegions();
        const tabla = this.querySelector('#tablaRegions');
        
        if (regions && regions.length > 0) {
            let filas = '';
            regions.forEach(region => {
                filas += `
                    <tr>
                        <td>${region.id}</td>
                        <td>${region.name}</td>
                        <td>${region.CountryId || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-region" data-id="${region.id}">Editar</button>
                            <button class="btn btn-sm btn-danger delete-region" data-id="${region.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            tabla.innerHTML = filas;

            tabla.querySelectorAll('.edit-region').forEach(btn => {
                btn.addEventListener('click', (e) => this.editRegion(e.target.dataset.id));
            });

            tabla.querySelectorAll('.delete-region').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteRegion(e.target.dataset.id));
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay regiones registradas</td></tr>';
        }
    }

    async editRegion(id) {
        const regions = await getRegions();
        const region = regions.find(r => r.id == id);
        
        const regRegion = document.querySelector('reg-region');
        if (regRegion) {
            regRegion.fillForm(region);
            document.querySelector('.mnuregion[data-verocultar*="#regRegion"]').click();
        }
    }

    async deleteRegion(id) {
        const response = await deleteRegions(id);
        if (response.ok) {
            this.loadRegions();
        }
    }
}

customElements.define('lst-region', LstRegion);
