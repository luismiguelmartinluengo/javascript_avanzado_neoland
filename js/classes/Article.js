//@ts-check

/**
 * @module Article
 */
//@ts-ignore
import{ translate } from 'utils/translate'

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
     * @param {string} parName 
     * @param {number} parQty
     * @param {number} parPrice
    */
    constructor(parName, parQty, parPrice){
        super(parName)
        this.qty = parQty || 1
        this.price = parPrice || 0
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
     * @param {string} parName 
     * @param {number} parQty 
     * @param {number} parPrice 
     * @returns {SimpleArticle | ComplexArticle}
     */
    createArticle(parType, parName, parQty, parPrice){
        switch (parType) {
            case ARTICLE_TYPES.COMPLEX:
                return new ComplexArticle(parName, parQty, parPrice)
            case ARTICLE_TYPES.SIMPLE:
            default:
                return new SimpleArticle(parName)
        }//End switch 
    }//End createArticle


    /**
     * Crea un artículo con el nombre traducido
     * @param {string} parType 
     * @param {string} parName 
     * @param {number} parQty 
     * @param {number} parPrice 
     * @returns {SimpleArticle | ComplexArticle}
     */
    createTranslatedArticle(parType, parName, parQty, parPrice){
        switch (parType) {
            case ARTICLE_TYPES.COMPLEX:
                return translateArticle(new ComplexArticle(parName, parQty, parPrice))
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


