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
    */
    constructor(_id = '',parName, parQty = 1, parPrice = 0){
        super(parName)
        this._id = _id
        this.qty = Number(parQty)
        this.price = Number(parPrice)
    }//End constructor

}//End ComplexArticle

//Patrón: Prototype
export const articuloLeche = {
    name: 'leche',
    qty: 12,
    price: 15
}//End articuloLeche

export const ARTICLE_TYPES = {
    SIMPLE: 'simple',
    COMPLEX: 'complex'
}//End ARTICLE_TYPES

export class ArticleFactory{

    /**
     * @param {string} parType
     * @param {string} _id 
     * @param {string} parName 
     * @param {number} parQty 
     * @param {number} parPrice 
     * @returns {SimpleArticle | ComplexArticle}
     */
    createArticle(parType, _id, parName, parQty, parPrice){
        switch (parType) {
            case ARTICLE_TYPES.COMPLEX:
                return new ComplexArticle(_id, parName, parQty, parPrice)
            case ARTICLE_TYPES.SIMPLE:
            default:
                return new SimpleArticle(parName)
        }//End switch 
    }//End createArticle


    /**
     * Crea un artículo con el nombre traducido
     * @param {string} parType
     * @param {string} _id;
     * @param {string} parName 
     * @param {number} parQty 
     * @param {number} parPrice 
     * @returns {SimpleArticle | ComplexArticle}
     */
    createTranslatedArticle(parType, _id, parName, parQty, parPrice){
        switch (parType) {
            case ARTICLE_TYPES.COMPLEX:
                return translateArticle(new ComplexArticle(_id, parName, parQty, parPrice))
            case ARTICLE_TYPES.SIMPLE:
            default:
                return translateArticle(new SimpleArticle(parName))
        }//End switch 
    }//End createArticle


}//End ArticleFactory

/**
 * traduce un artículo
 * @param {SimpleArticle | ComplexArticle} article 
 * @returns {SimpleArticle | ComplexArticle}
 */
function translateArticle(article){
    return {
        ...article, 
        name: translate.toEnglish(article.name)
    }//
}//End translateArticle


