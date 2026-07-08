//@ts-check

/**
 * @typedef {Object} ItemCompra
 * @property {string} id
 * @property {String} name 
 * @property {number} qty 
 * @property {number} price
 */

export class LocalStore{
    //Variables privadas
    #name
    #items

    /**
     * @param {string} parStoreName 
     */
    constructor(parStoreName){
        this.#name = parStoreName
        this.#items = this._getParsedDataFromLocalStorage(this.#name)
    }//End constructor

    get items(){
        return this.#items
    }//End 

    /**
     * @param {string} parKey 
     * @returns {ItemCompra[]}
     */
    _getParsedDataFromLocalStorage(parKey){
        const data = window.localStorage.getItem(parKey)
        if (!data){
            return []
        }else{
            try {
                return JSON.parse(data)
            }catch (e){
                console.error(`Error al parsear el JSon de localStaorate: ${e}`)
                return []
            }//End try
        }//End if
    }//End _getParsedDataFromLocalStorage

    /**
     * @param {ItemCompra[]} parData 
     */
    _setDataToLocalStorage(parData){
        window.localStorage.setItem(this.#name, JSON.stringify(parData))
    }//End _setDataToLocalStorage

    /**
     * 
     * @param {ItemCompra} parItem 
     */
    addItem(parItem){
        this.#items.push(parItem)
        this._setDataToLocalStorage(this.#items)
    }//End addItem

    /**
     * 
     * @param {ItemCompra} parItem 
     */
    removeItem(parItem) {
        const index = this.#items.findIndex(loopItem => loopItem.id === parItem.id)
        this.#items.splice(index, 1)
        this._setDataToLocalStorage(this.#items)
    }//End removeItem

    reset(){
        this.#items = []
        this._setDataToLocalStorage(this.#items)
    }//End reset

}//End LocalStore