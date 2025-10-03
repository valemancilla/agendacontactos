// ========================================
// API PARA PAÍSES
// ========================================
// Este archivo contiene todas las funciones para manejar países
// Se conecta con el servidor JSON para hacer operaciones CRUD

// URL del servidor para países
const URL_API = "http://localhost:3001/countries";
// Configuración de headers para las peticiones
const headers = { "Content-Type": "application/json" };

// Función para obtener todos los países del servidor
// Devuelve: array con todos los países
async function getCountries() {
    let response = await fetch(URL_API);
    let countries = await response.json();
    return countries;
}

// Función para crear un nuevo país
// Recibe: datos del país (nombre, etc.)
// Devuelve: respuesta del servidor con el país creado
async function postCountries(datos) {
    return await IdManager.createWithSequentialId('countries', datos);
}

// Función para actualizar un país existente
// Recibe: id del país y los nuevos datos
// Devuelve: respuesta del servidor
async function patchCountries(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Función para eliminar un país
// Recibe: id del país a eliminar
// Devuelve: respuesta del servidor
async function deleteCountries(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCountries,
    postCountries,
    patchCountries,
    deleteCountries
};