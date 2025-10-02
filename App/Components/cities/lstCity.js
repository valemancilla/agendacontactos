import { getCities, deleteCities } from '../../../Apis/city/cityApi.js';
import { getRegions } from '../../../Apis/region/regionApi.js';

export class LstCity extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Ciudades</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Región</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCities">
                            <tr><td colspan="4" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las ciudades
        this.loadCities();
    }

    async loadCities() {
        try {
            const [cities, regions] = await Promise.all([
                getCities(),
                getRegions()
            ]);
            
            const tabla = this.querySelector('#tablaCities');
            
            if (cities && cities.length > 0) {
                let filas = '';
                cities.forEach(city => {
                    // Buscar el nombre de la región
                    const region = regions.find(r => r.id === city.regionId);
                    const regionName = region ? region.name : 'No asignada';
                    
                    filas += `
                        <tr>
                            <td>${city.id}</td>
                            <td>${city.name}</td>
                            <td>${regionName}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-city" data-id="${city.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-city" data-id="${city.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                tabla.querySelectorAll('.edit-city').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editCity(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-city').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteCity(e.target.dataset.id));
                });
            } else {
                tabla.innerHTML = '<tr><td colspan="4" class="text-center">No hay ciudades registradas</td></tr>';
            }
        } catch (error) {
            console.error('Error cargando ciudades:', error);
            const tabla = this.querySelector('#tablaCities');
            tabla.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error al cargar las ciudades</td></tr>';
        }
    }

    async editCity(id) {
        const cities = await getCities();
        const city = cities.find(c => c.id == id);
        
        const regCity = document.querySelector('reg-city');
        if (regCity) {
            regCity.fillForm(city);
            document.querySelector('.mnucity[data-verocultar*="#regCity"]').click();
        }
    }

    async deleteCity(id) {
        const response = await deleteCities(id);
        if (response.ok) {
            this.loadCities();
        }
    }

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('citySaved', () => {
            console.log('Evento citySaved recibido, actualizando listado...');
            this.loadCities();
        });

        window.addEventListener('cityUpdated', () => {
            console.log('Evento cityUpdated recibido, actualizando listado...');
            this.loadCities();
        });

        window.addEventListener('cityDeleted', () => {
            console.log('Evento cityDeleted recibido, actualizando listado...');
            this.loadCities();
        });
    }
}

customElements.define('lst-city', LstCity);
