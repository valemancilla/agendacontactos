// ========================================
// API PARA CIUDADES
// ========================================
// Este archivo contiene todas las funciones para manejar ciudades
// Se conecta con el servidor JSON para hacer operaciones CRUD

// URL del servidor para ciudades
const URL_API = "http://localhost:3001/cities";
// Configuración de headers para las peticiones
const headers = { "Content-Type": "application/json" };

// Función para obtener todas las ciudades del servidor
// Devuelve: array con todas las ciudades
async function getCities() {
    let response = await fetch(URL_API);
    let cities = await response.json();
    return cities;
}

// Función para crear una nueva ciudad
// Recibe: datos de la ciudad (nombre, región, etc.)
// Devuelve: respuesta del servidor con la ciudad creada
async function postCities(datos) {
    return await IdManager.createWithSequentialId('cities', datos);
}

// Función para actualizar una ciudad existente
// Recibe: id de la ciudad y los nuevos datos
// Devuelve: respuesta del servidor
async function patchCities(id, datos) {
    return await fetch(`${URL_API}/${id}`, {
        method: "PATCH",
        headers: headers,
        body: JSON.stringify(datos)
    });
}

// Función para eliminar una ciudad
// Recibe: id de la ciudad a eliminar
// Devuelve: respuesta del servidor
async function deleteCities(id) {
    return await fetch(`${URL_API}/${id}`, {
        method: "DELETE",
        headers: headers
    });
}

export {
    getCities,
    postCities,
    patchCities,
    deleteCities
};