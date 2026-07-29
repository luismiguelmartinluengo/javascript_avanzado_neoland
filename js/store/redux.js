//@ts-check

/**
 * @module ReduxStore
 */

/** @import {ComplexArticle} from classes/Article.js */
/**
 * @typedef {Object} ActionTypeArticle
 * @property {string} type
 * @property {ComplexArticle} [article]
 */


const ACTION_TYPES = {
    CREATE_ARTICLE: 'CREATE_ARTICLE',
    READ_LIST: 'READ_LIST',
    UPDATE_ARTICLE: 'UPDATE_ARTICLE',
    DELETE_ARTICLE: 'DELETE_ARTICLE',
    DELETE_ALL_ARTICLES: 'DELETE_ALL_ARTICLES'
}//End ACTION_TYPES

/**
 * @typedef {Object.<(string), any>} State
 * @property {Array<ComplexArticle>} articles
 * /
 /** 
 *@type {State}
 */
export const INITIAL_STATE = {
    articles: []
}//End INITIAL_STATE

/**
 * 
 * @param {State} state El estado actual
 * @param {ActionTypeArticle} action la acción a ejecutar
 * @returns {State} El nuevo estado
 */

const appReducer = (state = INITIAL_STATE, action) => {
    //importante siempre castear la acción a su tipo correspondiente
    const actionWithArticle = /** @type {ActionTypeArticle} */ (action)

    switch (actionWithArticle.type) {
        case ACTION_TYPES.CREATE_ARTICLE:
            //Primero simulamos la creación de un id único para el artículo, en un escenario real esto lo haría la base de datos
            if (actionWithArticle?.article) {
                actionWithArticle.article._id = Date.now().toString()
            }//End if
            return {
                ...state,
                articles: [...state.articles, actionWithArticle.article]    
            }
        case ACTION_TYPES.READ_LIST:
            return state
        case ACTION_TYPES.UPDATE_ARTICLE:
            return {
                ...state,
                articles: state.articles.map(
                    (/** @type {ComplexArticle} */article) => article._id === actionWithArticle?.article?._id ? actionWithArticle.article : article
                )
            }
        case ACTION_TYPES.DELETE_ARTICLE:
            return{
                ...state,
                articles: state.articles.filter(
                    (/** @type {ComplexArticle} */ article) => article._id !== actionWithArticle?.article?._id 
                )
            }
        case ACTION_TYPES.DELETE_ALL_ARTICLES:
            return {
                ...state,
                articles: []
            }
        default:
            return state;
    }//End switch

}//End appReducer

/**
 * @typedef {Object} PublicMethods
 * @property {function} create
 * @property {function} read
 * @property {function} update
 * @property {function} delete
 * @property {function} getById
 * @property {function} getAll
 * @property {function} deleteAll
 */
/**
 * @typedef {Object} Store
 * @property {function} getState
 * @property {PublicMethods} article
 */

/**
 * 
 * @param {appReducer} reducer 
 * @returns {Store}
 */
const createStore = (reducer) => {

    let currentState = INITIAL_STATE
    let currentReducer = reducer

    // ======== Acciones ========= //

    /**
     * 
     * @param {ComplexArticle} article 
     * @param {function | undefined} [onEventDispatched] 
     * @returns void
     */
    const createArticle = (article, onEventDispatched) => {
        _dispatch({ type: ACTION_TYPES.CREATE_ARTICLE, article }, onEventDispatched)
    }//End createArticle

    /**
     * 
     * @param {function | undefined} [onEventDispatched]
     * @return void 
     */
    const readList = (onEventDispatched) => {
        _dispatch({ type: ACTION_TYPES.READ_LIST }, onEventDispatched)
    }//End readList

    /**
     * 
     * @param {ComplexArticle} article 
     * @param {function | undefined} [onEventDispatched]
     * @returns void 
     */
    const updateArticle = (article, onEventDispatched) => {
        _dispatch({ type: ACTION_TYPES.UPDATE_ARTICLE, article }, onEventDispatched)
    }//End updateArticle    

    /**
     * 
     * @param {ComplexArticle} article 
     * @param {function | undefined} [onEventDispatched] 
     * @returns void
     */
    const deleteArticle = (article, onEventDispatched) => {
        _dispatch({ type: ACTION_TYPES.DELETE_ARTICLE, article }, onEventDispatched)
    }//End deleteArticle    

    /**
     * 
     * @param {function | undefined} [onEventDispatched]
     * @returns void 
     */
    const deleteAllArticles = (onEventDispatched) => {
        _dispatch({ type: ACTION_TYPES.DELETE_ALL_ARTICLES }, onEventDispatched)
    }//End deleteAllArticles

     // ======== Métodos públicos ========= //

    const getState = () => {
        return currentState
    }//End getState

    /**
     * 
     * @param {string} id 
     * @returns {ComplexArticle | undefined}
     */
    const  getArticleById = (id) => {
        return currentState.articles.find((/** @type {ComplexArticle} */article) => article._id === id)
    }//End getArticleById

    const getAllAricles = () => {
        return currentState.articles
    }//End getAllAricles

     // ======== Métodos privados ========= //

    /**
     * 
     * @param {ActionTypeArticle} action 
     * @param {function | undefined} onEventDispatched 
     */
    const _dispatch = (action, onEventDispatched) => {
        let previousValue = currentState
        let currentValue = currentReducer(currentState, action)
        currentState = currentValue
        window.dispatchEvent(
            new CustomEvent('stateChanged', 
                            { 
                                detail: {changes: _getDifferences(previousValue, currentValue)},
                                cancelable: true,
                                composed: true,
                                bubbles: true 
                            } 
            )
        )
        if (onEventDispatched){
            onEventDispatched()
        }//End if
    }// End _dispatch

    /**
     * 
     * @param {State} previousValue 
     * @param {State} currentValue 
     * @returns {Object}
     * @private
     */
    const _getDifferences = (previousValue, currentValue) => {
        return Object.keys(currentValue).reduce(
            (diff, key) => {
                if (previousValue[key] === currentValue[key]) return diff
                return { ...diff, [key]: currentValue[key] }    
            }, {}
        )
    } //End _getDifferences

    //Namedspaced actiones for articles
   const article = {
        create: createArticle,
        read: readList,
        update: updateArticle,
        delete: deleteArticle,
        getById: getArticleById,
        getAll: getAllAricles,
        deleteAll: deleteAllArticles
    }//End article

    return {
        article, 
        getState
    }//End return

}//End createStore

//Store:
export const store = createStore(appReducer)