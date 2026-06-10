
//Sin patrón command
// export function translateString(parString){
//     //este método es solo un ejemplo, no hace traducción real.
//     //la traducción se podría implementar llamando a un servicio externo como el traductor de google
//     return `TRANSLATED: ${parString}`
// }//End

//Patrón Command
class Translator{

    toEnglish(parString){
        return `[ES > EN] ${parString}`
    }//End toEnglish

    toFrench(parString){
        return `[ES > RF] ${parString}`
    }//End toEnglish

    //Otros idiomas...

}//End  Traslator

export const translate = new Translator
