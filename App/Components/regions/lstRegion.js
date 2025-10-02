import { getRegions, deleteRegions } from '../../../Apis/region/regionApi.js';
import { getCountries } from '../../../Apis/country/countryApi.js';

export class LstRegion extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
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
                                <th>País</th>
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
        try {
            const [regions, countries] = await Promise.all([
                getRegions(),
                getCountries()
            ]);
            
            const tabla = this.querySelector('#tablaRegions');
            
            if (regions && regions.length > 0) {
                let filas = '';
                regions.forEach(region => {
                    // Buscar el nombre del país
                    const country = countries.find(c => c.id === region.countryId);
                    const countryName = country ? country.name : 'No asignado';
                    
                    filas += `
                        <tr>
                            <td>${region.id}</td>
                            <td>${region.name}</td>
                            <td>${countryName}</td>
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
        } catch (error) {
            console.error('Error cargando regiones:', error);
            const tabla = this.querySelector('#tablaRegions');
            tabla.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar las regiones</td></tr>';
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

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('regionSaved', () => {
            console.log('Evento regionSaved recibido, actualizando listado...');
            this.loadRegions();
        });

        window.addEventListener('regionUpdated', () => {
            console.log('Evento regionUpdated recibido, actualizando listado...');
            this.loadRegions();
        });

        window.addEventListener('regionDeleted', () => {
            console.log('Evento regionDeleted recibido, actualizando listado...');
            this.loadRegions();
        });
    }
}

customElements.define('lst-region', LstRegion);
