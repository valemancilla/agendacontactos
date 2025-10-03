import { getCountries, deleteCountries, patchCountries } from '../../../Apis/country/countryApi.js';

export class LstCountry extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Países</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCountries">
                            <tr><td colspan="3" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar los países
        this.loadCountries();
    }

    async loadCountries() {
        try {
            const countries = await getCountries();
            const tabla = this.querySelector('#tablaCountries');
            
            // Si hay países, mostrarlos
            if (countries && countries.length > 0) {
                let filas = '';
                countries.forEach(country => {
                    filas += `
                        <tr data-id="${country.id}">
                            <td>${country.id}</td>
                            <td>${country.name}</td>
                            <td>
                                <button class="btn btn-sm btn-warning edit-country" data-id="${country.id}">Editar</button>
                                <button class="btn btn-sm btn-danger delete-country" data-id="${country.id}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                tabla.innerHTML = filas;

                // Agregar event listeners a los botones
                tabla.querySelectorAll('.edit-country').forEach(btn => {
                    btn.addEventListener('click', (e) => this.editCountry(e.target.dataset.id));
                });

                tabla.querySelectorAll('.delete-country').forEach(btn => {
                    btn.addEventListener('click', (e) => this.deleteCountry(e.target.dataset.id));
                });
            } else {
                // Si no hay países, mostrar mensaje
                tabla.innerHTML = '<tr><td colspan="3" class="text-center">No hay países registrados</td></tr>';
            }
        } catch (error) {
            console.error('Error al cargar países:', error);
            const tabla = this.querySelector('#tablaCountries');
            tabla.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error al cargar los países</td></tr>';
        }
    }

    async editCountry(id) {
        try {
            const countries = await getCountries();
            const country = countries.find(c => c.id == id);
            
            // Encontrar la fila correspondiente en la tabla
            const fila = this.querySelector(`tr[data-id="${id}"]`);
            if (fila) {
                // Cambiar la celda del nombre a modo edición
                const celdaNombre = fila.querySelector('td:nth-child(2)');
                const nombreOriginal = country.name;
                
                celdaNombre.innerHTML = `
                    <input type="text" class="form-control form-control-sm" value="${nombreOriginal}" 
                           data-original="${nombreOriginal}" id="edit-name-${id}">
                `;
                
                // Cambiar los botones de acción
                const celdaAcciones = fila.querySelector('td:nth-child(3)');
                celdaAcciones.innerHTML = `
                    <button class="btn btn-sm btn-success save-country" data-id="${id}">Guardar</button>
                    <button class="btn btn-sm btn-secondary cancel-edit" data-id="${id}">Cancelar</button>
                `;
                
                // Agregar event listeners a los nuevos botones
                this.querySelector(`.save-country[data-id="${id}"]`).addEventListener('click', (e) => this.saveCountry(e.target.dataset.id));
                this.querySelector(`.cancel-edit[data-id="${id}"]`).addEventListener('click', (e) => this.cancelEdit(e.target.dataset.id));
                
                // Enfocar el input
                this.querySelector(`#edit-name-${id}`).focus();
            }
        } catch (error) {
            console.error('Error al obtener país:', error);
            alert('Error al obtener el país');
        }
    }

    async saveCountry(id) {
        try {
            const input = this.querySelector(`#edit-name-${id}`);
            const nuevoNombre = input.value.trim();
            
            if (!nuevoNombre) {
                alert('El nombre del país no puede estar vacío');
                return;
            }
            
            // Actualizar el país
            const response = await patchCountries(id, { name: nuevoNombre });
            if (response.ok) {
                // Recargar la tabla para mostrar los cambios
                this.loadCountries();
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al guardar país:', error);
            alert('Error al guardar el país: ' + error.message);
        }
    }

    cancelEdit(id) {
        // Recargar la tabla para volver al estado normal
        this.loadCountries();
    }

    async deleteCountry(id) {
        try {
            const response = await deleteCountries(id);
            if (response.ok) {
                this.loadCountries(); // Recargar la tabla
            } else {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al eliminar país:', error);
            alert('Error al eliminar el país: ' + error.message);
        }
    }

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('countrySaved', () => {
            console.log('Evento countrySaved recibido, actualizando listado...');
            this.loadCountries();
        });

        window.addEventListener('countryUpdated', () => {
            console.log('Evento countryUpdated recibido, actualizando listado...');
            this.loadCountries();
        });

        window.addEventListener('countryDeleted', () => {
            console.log('Evento countryDeleted recibido, actualizando listado...');
            this.loadCountries();
        });
    }
}

customElements.define('lst-country', LstCountry);
