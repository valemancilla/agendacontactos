import { getCities, deleteCities } from '../../../Apis/city/cityApi.js';

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
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCities">
                            <tr><td colspan="3" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las ciudades
        this.loadCities();
    }

    async loadCities() {
        const cities = await getCities();
        const tabla = this.querySelector('#tablaCities');
        
        if (cities && cities.length > 0) {
            let filas = '';
            cities.forEach(city => {
                filas += `
                    <tr>
                        <td>${city.id}</td>
                        <td>${city.name}</td>
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
            tabla.innerHTML = '<tr><td colspan="3" class="text-center">No hay ciudades registradas</td></tr>';
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
