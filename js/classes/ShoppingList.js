//Contiene la lógica de negocio de funcionamiento de la lista de la compra
import { addStringValidation } from "decorators/validate"

export class ShoppingList{

    #basket
    #store
    //Patrón Observer
    #observers = []

    constructor(store){
        this.#basket = []
        this.#store = store
        //Patrón decorador: Esto añade el decorador a la instancia de ShoppingList. Ahora tiene capacidades para validar si un valor es un texto
        addStringValidation(this)
    }//End constructor

    get basket(){
        return this.#store.items
    }//End get basket

    _addDataStore(item){
        this.#store.addItem(item)
        //Patrón observer
        this._notifySubscriptors('add', item)
    }//End _addDataStore

    _removeFronDataStore(parItem){
        this.#store.removeItem(parItem)
        //Patron observer
        this._notifySubscriptors('remove', parItem)
    }//End _removeFronDataStore

    _resetDataStore(){
        this.#store.reset()
    }//End _resetDataStore

    //Patrón observer
    _notifySubscriptors(eventName, eventData){
        this.#observers.forEach((subscriptor) => {
            if (subscriptor.eventName === eventName){
                subscriptor.callback(eventData)
            }//End if
        })
    }//End 

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

    removeItem(parItem){
        if (typeof parItem.id === 'string'){
            this._removeFronDataStore(parItem)
        }else {
            try{
                throw new TypeError('Invalid Item ID')
            }catch (e){
                console.error(e.name, e.message)
                if (e instanceof TypeError) console.log(e.stack)
            }//End try
        }//End if
    }//End removeItem


    //Patron Observer
    subscribe(subscriptor, eventName, callback){
        //Forma concisa de crear el objeto cuando el nombre de la propiedad es igual al nombre de la variable que se pasa con el valor
        this.#observers.push({subscriptor, eventName, callback})
    }//End subscribe

    //Patron Observer
    unsubscribe(subscriptor, eventName){
        this.#observers.find((observer, index) => {
            if (observer.subscriptor === suscriptor && observer.eventName === eventName){
                this.#observers.splice(index, 1)
            }//End If
        })
    }//End unsusbscribe


}//End ShoppingList

//Mixin
export const withTotalMixin = {
    getTotal() {
        let total = 0
        this.basket.forEach(item => total += item.price * item.qty ?? 0)
        return total
    }//End getTotal
}//End withTotalMixin
