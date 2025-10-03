// ========================================
// API PARA SUCURSALES
// ========================================
// Este archivo contiene todas las funciones para manejar sucursales
// Se conecta con el servidor JSON para hacer operaciones CRUD

// URL del servidor para sucursales
const URL_API = "http://localhost:3001/branches";
// Configuración de headers para las peticiones
const headers = { "Content-Type": "application/json" };

// Función para obtener todas las sucursales del servidor
// Devuelve: array con todas las sucursales
async function getBranches() {
    let response = await fetch(URL_API);
    let branches = await response.json();
    return branches;
}

// Función para crear una nueva sucursal
// Recibe: datos de la sucursal (número comercial, contacto, dirección, etc.)
// Devuelve: respuesta del servidor con la sucursal creada
async function postBranches(datos) {
    return await IdManager.createWithSequentialId('branches', datos);
}

// Función para actualizar una sucursal existente
// Recibe: id de la sucursal y los nuevos datos
// Devuelve: respuesta del servidor
async function patchBranches(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Función para eliminar una sucursal
// Recibe: id de la sucursal a eliminar
// Devuelve: respuesta del servidor
async function deleteBranches(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getBranches,
    postBranches,
    patchBranches,
    deleteBranches
};