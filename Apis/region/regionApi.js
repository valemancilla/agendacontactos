// ========================================
// API PARA REGIONES
// ========================================
// Este archivo contiene todas las funciones para manejar regiones
// Se conecta con el servidor JSON para hacer operaciones CRUD

// URL del servidor para regiones
const URL_API = "http://localhost:3001/regions";
// Configuración de headers para las peticiones
const headers = { "Content-Type": "application/json" };

// Función para obtener todas las regiones del servidor
// Devuelve: array con todas las regiones
async function getRegions() {
    let response = await fetch(URL_API);
    let regions = await response.json();
    return regions;
}

// Función para crear una nueva región
// Recibe: datos de la región (nombre, país, etc.)
// Devuelve: respuesta del servidor con la región creada
async function postRegions(datos) {
    return await IdManager.createWithSequentialId('regions', datos);
}

// Función para actualizar una región existente
// Recibe: id de la región y los nuevos datos
// Devuelve: respuesta del servidor
async function patchRegions(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Función para eliminar una región
// Recibe: id de la región a eliminar
// Devuelve: respuesta del servidor
async function deleteRegions(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getRegions,
    postRegions,
    patchRegions,
    deleteRegions
};