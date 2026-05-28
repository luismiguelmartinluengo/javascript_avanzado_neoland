//Contiene la lógica de negocio de funcionamiento de la lista de la compra
export class ShoppingList{

    #basket
    #store

    constructor(store){
        this.#store = store
        this.#basket = this.#store.items
    }//End constructor

    get basket(){
        return this.#basket
    }//End get basket

    _addDataStore(item){
        this.#store.addItem(item)
    }//End _addDataStore

}//End ShoppingList
