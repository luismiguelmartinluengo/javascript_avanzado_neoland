//@ts-check
//Patrón decorador

/** @param {Object} hostInstance */
export function addStringValidation(hostInstance){
    //Esto añade la función isString al espacio reservado "validate" de la instancia
    //@ts-ignore
    hostInstance.validate = {...hostInstance.validate, isString}
}//End addStringValidation

/**
 * 
 * @param {any} fieldValue 
 * @param {string} fieldName 
 * @returns {boolean}
 */
function isString(fieldValue, fieldName){
    if (typeof fieldValue === 'string'){
        return true
    }else{
        try{
            throw new TypeError(`${fieldName} must be a valid text string`)
        }catch (e){
            const typedError= /** @type {Error} */(e)
            console.error(typedError.name, typedError.message)
            if (e instanceof TypeError) console.log(e.stack)
        }//End try
        return false
    }//End if
}//End isString