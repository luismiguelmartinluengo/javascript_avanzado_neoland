//Patrón decorador

export function addStringValidation(hostInstance){
    //Esto añade la función isString al espacio reservado "validate" de la instancia
    hostInstance.validate = {...hostInstance.validate, isString}
    return
}//End addStringValidation


function isString(fieldValue, fieldName){
    if (typeof fieldValue === 'string'){
        return true
    }else{
        try{
            throw new TypeError(`${fieldName} must be a valid text string`)
        }catch (e){
            console.error(e.name, e.message)
            if (e instanceof TypeError) console.log(e.stack)
        }//End try
    }//End if
}//End isString