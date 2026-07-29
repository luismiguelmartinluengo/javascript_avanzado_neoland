//@ts-check

//Sin patrón command
// export function translateString(parString){
//     //este método es solo un ejemplo, no hace traducción real.
//     //la traducción se podría implementar llamando a un servicio externo como el traductor de google
//     return `TRANSLATED: ${parString}`
// }//End

//Patrón Command
class Translator{

    /** @param {string} parString  */
    toEnglish(parString){
        return `[ES > EN] ${parString}`
    }//End toEnglish

    /** @param {string} parString  */
    toFrench(parString){
        return `[ES > FR] ${parString}`
    }//End toFrench

    //Otros idiomas...

}//End  Traslator

export const translate = new Translator
