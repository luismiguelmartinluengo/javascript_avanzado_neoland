//@ts-check

//Patrón Decorator
/** @import {ShoppingList} from /classes/ShoppingList.js */

/**
 * 
 * @param {ShoppingList} shoppingListInstance 
 * @returns {ShoppingList}
 */
export function logBasket(shoppingListInstance){

    //Con esto se añade un método adicional (log) a la instancia particular, no a la clase en general.
    shoppingListInstance.log = function() {
                                console.log(this.basket)
                                }//End function
    
    return shoppingListInstance

}//End logBasket