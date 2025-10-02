import { getCompanies, deleteCompanies } from '../../../Apis/company/companyApi.js';

export class LstCompany extends HTMLElement {
    constructor() {
        super();
        this.mostrarPagina();
    }

    async mostrarPagina() {
        // Crear la tabla HTML
        this.innerHTML = `
            <div class="card mt-3">
                <div class="card-header">Listado de Empresas</div>
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>UKNiu</th>
                                <th>Email</th>
                                <th>City ID</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaCompanies">
                            <tr><td colspan="6" class="text-center">Cargando...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // Cargar las empresas
        this.loadCompanies();
    }

    async loadCompanies() {
        const companies = await getCompanies();
        const tabla = this.querySelector('#tablaCompanies');
        
        if (companies && companies.length > 0) {
            let filas = '';
            companies.forEach(company => {
                filas += `
                    <tr>
                        <td>${company.id}</td>
                        <td>${company.name}</td>
                        <td>${company.UKNiu}</td>
                        <td>${company.email || 'N/A'}</td>
                        <td>${company.CityId || 'N/A'}</td>
                        <td>
                            <button class="btn btn-sm btn-warning edit-company" data-id="${company.id}">Editar</button>
                            <button class="btn btn-sm btn-danger delete-company" data-id="${company.id}">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
            tabla.innerHTML = filas;

            tabla.querySelectorAll('.edit-company').forEach(btn => {
                btn.addEventListener('click', (e) => this.editCompany(e.target.dataset.id));
            });

            tabla.querySelectorAll('.delete-company').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteCompany(e.target.dataset.id));
            });
        } else {
            tabla.innerHTML = '<tr><td colspan="6" class="text-center">No hay empresas registradas</td></tr>';
        }
    }

    async editCompany(id) {
        const companies = await getCompanies();
        const company = companies.find(c => c.id == id);
        
        const regCompany = document.querySelector('reg-company');
        if (regCompany) {
            regCompany.fillForm(company);
            document.querySelector('.mncompany[data-verocultar*="#regCompany"]').click();
        }
    }

    async deleteCompany(id) {
        const response = await deleteCompanies(id);
        if (response.ok) {
            this.loadCompanies();
        }
    }
}

customElements.define('lst-company', LstCompany);
