import{ translateString } from '../utils/translate.js'

//Patrón: Factory
class SimpleArticle{

    constructor(parName){
        this.name = parName
    }//End  constructor

}//End SimpleArticle

//Herencia
class ComplexArticle extends SimpleArticle{

    constructor(parName, parQty, parPrice){
        super(parName)
        this.qty = parQty
        this.price = parPrice
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

    createArticle(parType, parName, parQty, parPrice){
        switch (parType) {
            case ARTICLE_TYPES.COMPLEX:
                return new ComplexArticle(parName, parQty, parPrice)
            case ARTICLE_TYPES.SIMPLE:
            default:
                return new SimpleArticle(parName)
        }//End switch 
    }//End createArticle

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


function translateArticle(article){
    return {
        ...article, 
        name: translateString(article.name)
    }
}//End translateArticle


