const URL_API = "http://localhost:3000/branches";
const myHeaders = new Headers({
    "Content-Type": "application/json"
});

const getBranches = async() => {
    try {
        const respuesta = await fetch(URL_API);
        if(respuesta.status === 200){
            const datos = await respuesta.json();
            return datos;
        } else if(respuesta.status === 401){
            console.log('La url no es correcta');
        } else if(respuesta.status === 404){
            console.log('La sucursal no existe');
        } else {
            console.log('Se presentó un error en la petición consulte al Administrador');
        } 
    } catch(error){
        console.error('Error al obtener sucursales:', error);
    }
}

const postBranches = async (datos) => {
    try {
        return await fetch(URL_API, {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
}

const patchBranches = async (datos,id) =>{
    try {
        return await fetch(`${URL_API}/${id}`, {
            method: "PATCH",
            headers: myHeaders,
            body: JSON.stringify(datos)
        });
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
}

const deleteBranches = async (id) =>{
    try {
        return await fetch(`${URL_API}/${id}`, {
            method: "DELETE",
            headers: myHeaders,
        });
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
}

export {
    getBranches,
    postBranches,
    patchBranches,
    deleteBranches
};