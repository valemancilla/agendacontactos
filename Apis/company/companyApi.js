// ========================================
// API PARA EMPRESAS
// ========================================
// Este archivo contiene todas las funciones para manejar empresas
// Se conecta con el servidor JSON para hacer operaciones CRUD

// URL del servidor para empresas
const URL_API = "http://localhost:3001/companies";
// Configuración de headers para las peticiones
const headers = { "Content-Type": "application/json" };

// Función para obtener todas las empresas del servidor
// Devuelve: array con todas las empresas
async function getCompanies() {
    let response = await fetch(URL_API);
    let companies = await response.json();
    return companies;
}

// Función para crear una nueva empresa
// Recibe: datos de la empresa (nombre, UKNiu, dirección, etc.)
// Devuelve: respuesta del servidor con la empresa creada
async function postCompanies(datos) {
    return await IdManager.createWithSequentialId('companies', datos);
}

// Función para actualizar una empresa existente
// Recibe: id de la empresa y los nuevos datos
// Devuelve: respuesta del servidor
async function patchCompanies(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Función para eliminar una empresa
// Recibe: id de la empresa a eliminar
// Devuelve: respuesta del servidor
async function deleteCompanies(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCompanies,
    postCompanies,
    patchCompanies,
    deleteCompanies
};