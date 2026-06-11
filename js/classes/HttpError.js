export class HttpError extends Error{
    //Objeto Error mejorado que devuelve el status
    constructor(response){
        super(`HTTP Error ${response.status}`)
    }//End constructor
}//End HttpError