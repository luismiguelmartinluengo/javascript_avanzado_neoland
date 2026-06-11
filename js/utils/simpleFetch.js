import { HttpError } from "../classes/HttpError.js"

export async function simpleFetch(url, options){
    //Función que permite encapsular las operaciones fetch usando la clase HttpError (objeto Error mejorado)
    const resultado = await fetch(url, options)
    if(!resultado.ok){
        throw new HttpError(resultado);
    }//End if
    return await resultado.json();
}//Edn simpleFetch