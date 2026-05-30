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

    _resetDataStore(){
        this.#store.reset()
    }//End _resetDataStore

    addItem(newItem){
        if (typeof newItem.name === 'string'){
            this.#basket.push(newItem)
            this._addDataStore(newItem)
        }else{
            try{
                throw new TypeError('Article debe tener un nombre (name)')
            }catch (e){
                console.error(e.name, e.message)
                if (e instanceof TypeError) console.log(e.stack)
            }//End try
        }//End if
    }//End addItem

    emptyBasket(){
        this.#basket = []
        this._resetDataStore()
    }//End emptyBasket

}//End ShoppingList
