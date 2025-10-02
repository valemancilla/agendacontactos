const URL_API = "https://68dc4b837cd1948060a9f214.mockapi.io/";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});
const getContact = async() => {
    try {
        console.log('Obteniendo contactos de:', `${URL_API}/contacts`);
        const respuesta = await fetch(`${URL_API}/contacts`);
        console.log('Respuesta GET status:', respuesta.status);
        
        // Si la respuesta es correcta
        if(respuesta.status === 200){
            const datos = await respuesta.json();
            console.log('Contactos obtenidos:', datos);
            return datos;
        } else if(respuesta.status === 401){
            console.log('La url no es correcta');
        } else if(respuesta.status === 404){
            console.log('El contacto no existe');
        } else {
            console.log('Se presentó un error en la petición consulte al Administrador');
        } 
    } catch(error){
        console.error('Error al obtener contactos:', error);
    }
}
const postContact = async (datos) => {
    try {
        return await fetch(`${URL_API}/contacts`, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}
const patchContact = async (datos,id) =>{
    try {
        console.log('Enviando PATCH a:', `${URL_API}/contacts/${id}`);
        console.log('Datos enviados:', datos);
        
        const response = await fetch(`${URL_API}/contacts/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
        
        console.log('Respuesta PATCH status:', response.status);
        console.log('Respuesta PATCH:', response);
        
        return response;
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
        throw error;
    }
}
const deleteContact = async (id) =>{

    try {
        return await fetch(`${URL_API}/contacts/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }

}

export {
    getContact as getContacts,
    postContact as postContacts,
    patchContact as patchContacts,
    deleteContact as deleteContacts
};
