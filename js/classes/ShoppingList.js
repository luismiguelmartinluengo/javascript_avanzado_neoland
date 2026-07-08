//Contiene la lógica de negocio de funcionamiento de la lista de la compra
//@ts-check

/**
 * Esto reserva un espacio de memoria en typeScript para reconocer este objeto
 * @module ShoppingList
 */

//@ts-ignore
import { addStringValidation } from "decorators/validate"
/** @import { ComplexArticle } from "./Article.js" */
/** @import { LocalStore } from "./LocalStore.js" */

/**
 * @typedef {Object} Subscriptor
 * @property {object} subscriptor
 * @property {string} eventName
 * @property {function} callback
 */


export class ShoppingList{

    /** @type {Array<ComplexArticle>} */
    #basket
    /** @type {LocalStore} */
    #store
    //Patrón Observer
    /** @type {Array<Subscriptor>} */
    #observers

    /** @param {LocalStore} store */
    constructor(store){
        /** @private */
        this.#basket = []
        /** @private */
        this.#store = store
        /** @private */
        this.#observers = []
        this._syncStoreData()
        //Patrón decorador: Esto añade el decorador a la instancia de ShoppingList. Ahora tiene capacidades para validar si un valor es un texto
        addStringValidation(this)
    }//End constructor

    get basket(){
        return this.#store.items
    }//End get basket

    /** @param {ComplexArticle} item */
    _addDataStore(item){
        this.#store.addItem(item)
        //Patrón observer
        this._notifySubscriptors('add', item)
    }//End _addDataStore

    /** @param {ComplexArticle} parItem */
    _removeFronDataStore(parItem){
        this.#store.removeItem(parItem)
        //Patron observer
        this._notifySubscriptors('remove', parItem)
    }//End _removeFronDataStore

    _syncStoreData(){
        this.#basket = this.#store.items
    }//End _syncStoreData

    _resetDataStore(){
        this.#store.reset()
    }//End _resetDataStore

    //Patrón observer
    /**
     * 
     * @param {string} eventName 
     * @param {any} eventData 
     */

    _notifySubscriptors(eventName, eventData){
        this.#observers.forEach((subscriptor) => {
            if (subscriptor.eventName === eventName){
                console.log(subscriptor, eventName, eventData)
                subscriptor.callback(eventData)
            }//End if
        })
    }//End 

    /** @param {ComplexArticle} newItem */
    addItem(newItem){
        // Sin decorador
        // if (typeof newItem.name === 'string'){
        //     this.#basket.push(newItem)
        //     this._addDataStore(newItem)
        // }else{
        //     try{
        //         throw new TypeError('Article debe tener un nombre (name)')
        //     }catch (e){
        //         console.error(e.name, e.message)
        //         if (e instanceof TypeError) console.log(e.stack)
        //     }//End try
        // }//End if
        //Patron decorator
        //@ts-ignore, el patrón decorador no lo entiende typescript según está programado
        if (this.validate.isString(newItem.name, "Nombre artículo")){
            const momento = new Date()
            newItem.id = `${newItem.name}_${String(momento.getTime())}`
            newItem.qty = Number(newItem.qty)
            newItem.price = Number(newItem.price)
            this._addDataStore(newItem)
            return true
        }else{
            return false
        }//End if
    }//End addItem
   

    emptyBasket(){
        this._resetDataStore()
    }//End emptyBasket

    /** 
     * @param {ComplexArticle} parItem 
     * @throws {TypeError} 
     */
    removeItem(parItem){
        if (typeof parItem.id === 'string'){
            this._removeFronDataStore(parItem)
        }else {
            try{
                throw new TypeError('Invalid Item ID')
            }catch (e){
                const typedError = /** @type {Error} */ (e)
                console.error(typedError.name, typedError.message)
                if (e instanceof TypeError) console.log(e.stack)
            }//End try
        }//End if
    }//End removeItem


    //Patron Observer
    /**
     * 
     * @param {Subscriptor} subscriptor 
     * @param {string} eventName 
     * @param {function} callback
     */
    subscribe(subscriptor, eventName, callback){
        //Forma concisa de crear el objeto cuando el nombre de la propiedad es igual al nombre de la variable que se pasa con el valor
        this.#observers.push({subscriptor, eventName, callback})
    }//End subscribe

    /**
     * 
     * @param {Subscriptor} subscriptor 
     * @param {string} eventName 
     */
    //Patron Observer
    unsubscribe(subscriptor, eventName){
        this.#observers.find((observer, index) => {
            if (observer.subscriptor === subscriptor && observer.eventName === eventName){
                this.#observers.splice(index, 1)
            }//End If
        })
    }//End unsusbscribe


}//End ShoppingList

//Mixin
export const withTotalMixin = {
    getTotal() {
        let total = 0
        // @ts-ignore, type Script, en los Mixin, el ámbito de this es solo el propio mixin, por lo que no puede encontrar la propiedad basket, que es del objeto donde se inserta el mixin
        this.basket.forEach(item => total += item.price * item.qty ?? 0)
        return total
    }//End getTotal
}//End withTotalMixin
