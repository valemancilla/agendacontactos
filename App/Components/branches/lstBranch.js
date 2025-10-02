import { getBranches, deleteBranches } from '../../../Apis/branch/branchApi.js';

export class LstBranch extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
        this.setupEventListeners();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Sucursales</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Número Comercial</th>
                                <th>Contacto</th>
                                <th>Teléfono</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaBranches">
                            <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las sucursales
        this.loadBranches();
    }

    async loadBranches() {
        const branches = await getBranches();
        const tabla = this.querySelector('#tablaBranches');
        
        if (branches && branches.length > 0) {
            let filas = '';
            branches.forEach(branch => {
                filas += `
                    <tr>
                        <td>${branch.id}</td>
                        <td>${branch.numberComercial}</td>
                        <td>${branch.Contact_name}</td>
                        <td>${branch.Phone || 'N/A'}</td>
                        <td>${branch.email || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-branch" data-id="${branch.id}">Editar</button>
                            <button class="btn btn-sm btn-danger delete-branch" data-id="${branch.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            tabla.innerHTML = filas;

            tabla.querySelectorAll('.edit-branch').forEach(btn => {
                btn.addEventListener('click', (e) => this.editBranch(e.target.dataset.id));
            });

            tabla.querySelectorAll('.delete-branch').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteBranch(e.target.dataset.id));
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay sucursales registradas</td></tr>';
        }
    }

    async editBranch(id) {
        const branches = await getBranches();
        const branch = branches.find(b => b.id == id);
        
        const regBranch = document.querySelector('reg-branch');
        if (regBranch) {
            regBranch.fillForm(branch);
            document.querySelector('.mnubranch[data-verocultar*="#regBranch"]').click();
        }
    }

    async deleteBranch(id) {
        const response = await deleteBranches(id);
        if (response.ok) {
            this.loadBranches();
        }
    }

    setupEventListeners() {
        // Escuchar eventos de guardado, actualización y eliminación
        window.addEventListener('branchSaved', () => {
            console.log('Evento branchSaved recibido, actualizando listado...');
            this.loadBranches();
        });

        window.addEventListener('branchUpdated', () => {
            console.log('Evento branchUpdated recibido, actualizando listado...');
            this.loadBranches();
        });

        window.addEventListener('branchDeleted', () => {
            console.log('Evento branchDeleted recibido, actualizando listado...');
            this.loadBranches();
        });
    }
}

customElements.define('lst-branch', LstBranch);
