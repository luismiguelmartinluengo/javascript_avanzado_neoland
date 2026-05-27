export class LocalStore{
    //Variables privadas
    #name
    #items

    constructor(parStoreName){
        this.#name = parStoreName
        this.#items = this._getParsedDataFromLocalStorage(this.#name)
    }//End constructor

    get items(){
        return this.#items
    }//End 

    _getParsedDataFromLocalStorage(parKey){
        return JSON.parse(window.localStorage.getItem(parKey)) || []
    }//End _getParsedDataFromLocalStorage

    _setDataToLocalStorage(parData){
        window.localStorage.setItem(this.#name, JSON.stringify(parData))
    }//End _setDataToLocalStorage

    addItem(parItem){
        this.#items.push(parItem)
        this._setDataToLocalStorage(this.#items)
    }//End addItem

    reset(){
        this.#items = []
        this._setDataToLocalStorage(this.#items)
    }//End reset

}//End LocalStore