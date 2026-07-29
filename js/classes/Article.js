//@ts-check

/**
 * @module Article
 */
//@ts-ignore
import{ translate } from '../utils/translate.js'

//Patrón: Factory
class SimpleArticle{

    /** @param {string} parName*/
    constructor(parName){
        this.name = parName
        this.id = ''
    }//End  constructor

}//End SimpleArticle

//Herencia
export class ComplexArticle extends SimpleArticle{

    /**
     * @param {string} _id
     * @param {string} parName 
     * @param {number} parQty
     * @param {number} parPrice
     * @param {boolean} parBought
    */
    constructor(_id = '',parName, parQty = 1, parPrice = 0, parBought = false){
        super(parName)
        this._id = _id
        this.qty = Number(parQty)
        this.price = Number(parPrice)
        this.bought = parBought
    }//End constructor

}//End ComplexArticle

