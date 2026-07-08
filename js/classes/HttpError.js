//@ts-check

/**
 * @typedef {Object} ResponseLike
 * @property {number} status
 */

export class HttpError extends Error{
    //Objeto Error mejorado que devuelve el status
    /**
     * 
     * @param {ResponseLike} response 
     */
    constructor(response){
        super(`HTTP Error ${response.status}`)
    }//End constructor
}//End HttpError