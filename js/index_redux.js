//@ts-check

import { ComplexArticle } from './classes/Article.js'
import { simpleFetch } from './utils/simpleFetch.js'
import { INITIAL_STATE, store } from './store/redux.js'
/** @import {State} from './store/redux.js' */


document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

//Esto funciona como constructor
function onDOMContentLoaded(){
    const formulario = document.getElementById('formulario')
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    const botonNuevaLista = document.getElementById('nuevaLista')
        

    //? valida que no es nulo y solo aplica addEvent si no es nulo
    formulario?.addEventListener('submit', onFormSubmit)
    campoArticulo?.addEventListener('keyup', onInputKeyUp)
    botonArticulo?.addEventListener('click', onNewArticleClick)
    botonNuevaLista?.addEventListener('click', onNewListClick)

    //getUsualProducts() --> esto lo tiene que explicar más adelante
    //Dynamic import --> llevamos la importación de módulos necesarios para Shoppinglist al momento en el que se crea listacompra
    setUpShoppingList()

}//End onDOMContentLoaded

/**@param {Event} e */
function onFormSubmit(e){
    e.preventDefault()
}//End onFormSubmit

/**@param {KeyboardEvent} e */
function onInputKeyUp(e){
    e.stopPropagation()
    const botonArticulo = document.getElementById('nuevoArticulo')
    const textoArticulo = document.getElementById('articulo')
    if (botonArticulo !== null && textoArticulo !== null) {
        //Si se pulsa el enter, se genera un evento click sobre el bottón de Articulo
        if (e.code === 'Enter'){
            const clickEvent = new MouseEvent('click', {bubbles: true, cancelable: true, view: window,})
            botonArticulo.dispatchEvent(clickEvent)
            return
        }//End if
        if (textoArticulo instanceof HTMLInputElement){
            if(textoArticulo.value !== ''){
                botonArticulo.removeAttribute('disabled')
            }else{
                botonArticulo.setAttribute('disabled', 'true')
            }//End if
        }
    }//End if
}//End onInputKeyUP

/**@param {Event} e */
function onNewArticleClick(e){
    e.stopPropagation()
    addToShoppingList()
}//End onNewArticleClick

/**@param {Event} e */
function onNewListClick(e){
    e.stopPropagation()
    resetShoppingList()
}//End onNewListClick


function setUpShoppingList(){
    const state = getDataFromLocalStorage()

    state.articles.forEach((/** @type {ComplexArticle} */ article) => {
        store.article.create(article, () => {
            addToElementsList(article) 
        })
    })
}//End setUpShoppingList

/**
 * se va a pasar un elemento html, después se transformará en HTMLInputElement para poder recuperar la variable value
 * @param {HTMLElement | null} inputElement 
 * @returns {string}
 */
export function getInputValue(inputElement, defaultValue = '') {
    if (inputElement){
        return /** @type {HTMLInputElement} */ (inputElement).value
    } else {
        return defaultValue
    }//End if
}//End getInputValue

/**
 * 
 * @param {HTMLElement | null} inputElement 
 * @param {string} value 
 */
export function setInputValue(inputElement, value){
    if (inputElement){
        /** @type {HTMLInputElement} */ (inputElement).value = value
    }//End if
}//End setInputValue

function addToShoppingList(){
    const elementoNuevoArticulo = document.getElementById('articulo')
    let nombreArticulo = getInputValue(elementoNuevoArticulo, '')
    if (nombreArticulo !== ''){
        const elementoQtyArticulo = document.getElementById('qty')
        let qtyArticulo = getInputValue(elementoQtyArticulo, '1')
        const elementoPrecioArticulo = document.getElementById('price')
        let precioArticulo = getInputValue(elementoPrecioArticulo, '0')
        //El id del producto lo pone la base de datos, por eso se pasa undefined, aunque lo mejor sería eliminar el parámetro del constructor
        const nuevoObjetoArticulo = new ComplexArticle(undefined, nombreArticulo, parseInt(qtyArticulo), parseFloat(precioArticulo))
        /*El uso de la redux store pasándole un objeto y la función de callback permite que el flujo
        de ejecución se haga de forma asíncrona, de manera que la función de callback se ejecuta 
        cuando la store ha terminado de actualizarse */
        store.article.create(nuevoObjetoArticulo, () => {
            setLocalStorageFromStore()
            addToElementsList(nuevoObjetoArticulo)
        })
    }//End if
   
}//End addToShoppingList

/** @param {ComplexArticle} nuevoArticulo*/
function addToElementsList(nuevoArticulo){
    const listaArticulos = document.getElementById('lista')
    if (listaArticulos !== null){
        const elemento = document.createElement('li')
        const articulo = document.createElement('span')
        const boton = document.createElement('button')
        articulo.classList.add('articulo')
        let articuloText = nuevoArticulo.name
        if (nuevoArticulo?.qty > 0) {
            articuloText = `${articuloText} x ${nuevoArticulo.qty}`
        }//End if
        if (nuevoArticulo?.price> 0) {
            articuloText = `${articuloText} @ ${nuevoArticulo.price}`
        }//End if
        articulo.innerText = articuloText
        articulo.addEventListener('click', buyArticle.bind(elemento, nuevoArticulo))
        boton.innerText = 'BORRAR'
        boton.addEventListener('click', removeFromShoppingList.bind(boton, nuevoArticulo), {once: true})
        elemento.appendChild(articulo)
        elemento.appendChild(boton)
        elemento.appendChild(boton)
        elemento.id = nuevoArticulo._id
        listaArticulos.appendChild(elemento)
    }//End if
    resetFormState()
}//End addToElementsList

/**
 * 
 * @param {ComplexArticle} parArticulo 
 * @this {HTMLElement}
 */
function buyArticle(parArticulo){
    const storeArticle = store.article.getById(parArticulo._id)
    const articuloComprado = {... storeArticle, bought:!storeArticle.bought}
    store.article.update(articuloComprado, () => {
        setLocalStorageFromStore()
        if (articuloComprado.bought){   
            this.classList.add('bought')
        } else {
            this.classList.remove('bought')
        }//End if
    })
}//End buyArticle

/** @param {ComplexArticle} parArticulo*/
function removeFromShoppingList(parArticulo){
    console.log(`removeFromShoppingList: ${parArticulo.name}`)  
    store.article.delete(parArticulo, () => {
        setLocalStorageFromStore()
        removeFromElementsList(parArticulo)
    })
}//End removeFromShoppingList

/** @param {ComplexArticle} parArticulo*/
function removeFromElementsList(parArticulo){
    console.log(`removeFromElementsList: ${parArticulo._id}`)
    const listaArticulos = document.getElementById('lista')
    if (listaArticulos !== null){
        for (const node of listaArticulos.children){
            if (node.id === parArticulo._id){
                node.remove()
            }//End if
        }//End for
        resetFormState()
    }//Emd if
}//End removeFromElementsList

function resetShoppingList(){
    const listaArticulos = document.querySelectorAll('#lista li')

    store.article.deleteAll(() => {
            setLocalStorageFromStore()           
    })

    for (const nodo of listaArticulos) {
        nodo.remove()
    }//End for

    resetFormState()
}//End resetShoppingList

function resetFormState(){
    const campoArticulo = document.getElementById('articulo')
    const campoQty = document.getElementById('qty')
    const campoPrecio = document.getElementById('price')    
    const botonArticulo = document.getElementById('nuevoArticulo')
    const totalLista = document.getElementById('total')
    const articulos = store.article.getAll()
    setInputValue(campoArticulo, '')
    setInputValue(campoQty, '1')
    setInputValue(campoPrecio, '0')
    botonArticulo?.setAttribute('disabled', 'true')
    if (totalLista instanceof HTMLSpanElement){
         let total = 0
         articulos.forEach((/** @type {ComplexArticle} */ Articulo) => {
            total += Articulo.qty * Articulo.price
         })//End for
         totalLista.innerText = `${total.toFixed(2)} €`
    }//End if
    //Patrón Decorator
    //lo descativo, no lo voy a usar
    //listaCompra.get().log()
}//resetFormState

//Se exporta para poder hacer pruebas unitarias sobre la función
export function getDataFromLocalStorage() {
    const devaultValue = JSON.stringify(INITIAL_STATE)
    return JSON.parse(localStorage.getItem('shoppingList') || devaultValue)
}//End getDataFromLocalStorage

function setLocalStorageFromStore(){
    const storeState = store.getState()
    updateLocalStorage(storeState)
}//End setLocalStorageFromStore

//Se exporta para poder hacer pruebas unitarias sobre la función
export function updateLocalStorage(/** @type {State} */ storeValue){
    localStorage.setItem('shoppingList', JSON.stringify(storeValue))
}//End updateLocalStorage