import { ARTICLE_TYPES, ArticleFactory, articuloLeche } from "../classes/Article.js"
import { ShoppingList } from "../classes/ShoppingList.js"
import { LocalStore } from "../classes/LocalStore.js"
import { logBasket } from "../decorators/log.js"

//Patron Factory
const fabricaArticulos = new ArticleFactory
//Patron Singleton
let listaCompra = (function(){

    function create(){
        const dataStore = new LocalStore('lista-compra')
        return new ShoppingList(dataStore)
    }//End create

    let shoppingListInstance

    return{
        get: () =>{
            if (!shoppingListInstance){
                // Aquí se crea la instancia de lista de la compra a través de logbasket para añadirle el decorador
                // que añade a la instancia el método log
                shoppingListInstance = logBasket(create())
            }//End if
            return shoppingListInstance
        }//end get
    }

})()


document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

//Esto funciona como constructor
function onDOMContentLoaded(){
    const formulario = document.getElementById('formulario')
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    const botonNuevaLista = document.getElementById('nuevaLista')
        

    formulario.addEventListener('submit', onFormSubmit)
    campoArticulo.addEventListener('keyup', onInputKeyUp)
    botonArticulo.addEventListener('click', onNewArticleClick)
    botonNuevaLista.addEventListener('click', onNewListClick)

    loadShoppingList()
    //Patron Observer
    listaCompra.get().subscribe('formulario', 'add', addToElementsList)
    listaCompra.get().subscribe('formulario', 'remove', removeFromElementsList)
}//End onDOMContentLoaded

function onFormSubmit(e){
    e.preventDefault()
}//End onFormSubmit

function onInputKeyUp(e){
    e.stopPropagation()
    const botonArticulo = document.getElementById('nuevoArticulo')
    //Si se pulsa el enter, se genera un evento click sobre el bottón de Articulo
    if (e.code === 'Enter'){
        const clickEvent = new MouseEvent('click', {bubbles: true, cancelable: true, view: window,})
        botonArticulo.dispatchEvent(clickEvent)
        return
    }//End if

    if(this.value !== ''){
        botonArticulo.removeAttribute('disabled')
    }else{
        botonArticulo.setAttribute('disabled', undefined)
    }//End if
}//End onInputKeyUP

function onNewArticleClick(e){
    e.stopPropagation()
    addToShoppingList()
}//End onNewArticleClick

function onNewListClick(e){
    e.stopPropagation()
    resetShoppingList()
}//End onNewListClick

function loadShoppingList(){
    
    if (listaCompra.get().basket.length > 0){
        for(let articulo of listaCompra.get().basket){
            addToElementsList(articulo)
        }//End for
    }//End if
}//End loadShoppingList

function addToShoppingList(){
    const nuevoArticulo = document.getElementById('articulo').value
    if(nuevoArticulo !== ''){
        const nuevoObjetoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.SIMPLE, nuevoArticulo)
        listaCompra.get().addItem(nuevoObjetoArticulo) //Al estar suscrito el evento add de la ShoppingList, se ejecutará la función addToElementList ya que es el método callback pasado en la suscripción
    }//End if
}//End addToShoppingList

function addToElementsList(nuevoArticulo){
    const listaArticulos = document.getElementById('lista')
    const elemento = document.createElement('li')
    const boton = document.createElement('button')
    elemento.innerText = nuevoArticulo.name
    elemento.id = nuevoArticulo.id
    boton.innerText = 'BORRAR'
    boton.addEventListener('click', removeFromShoppingList.bind(this, nuevoArticulo), {once: true})
    elemento.appendChild(boton)
    listaArticulos.appendChild(elemento)
    resetFormState()
}//End addToElementsList

function removeFromShoppingList(parArticulo){
    listaCompra.get().removeItem(parArticulo) //Al estar suscrito al evento remove de la ShoppingList, se ejecutar la función removeFronElementList
}//End removeFromShoppingList

function removeFromElementsList(parArticulo){
    console.log('entra en removeFromElementsList')
    console.log(parArticulo)
    const listaArticulos = document.getElementById('lista')
    for (const node of listaArticulos.children){
        console.log('explora', node)
        if (node.id === parArticulo.id){
            console.log('va a eliminar', node)
            listaArticulos.removeChild(node)
        }//End if
    }//End for
}//End removeFromElementsList

function resetShoppingList(){
    const listaArticulos = document.getElementById('lista')
    listaCompra.get().emptyBasket()
    while (listaArticulos.children.length > 1){
        listaArticulos.lastElementChild.remove()
    }//End while
    resetFormState()
}//End resetShoppingList

function resetFormState(){
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    campoArticulo.value = ''
    botonArticulo.setAttribute('disabled', undefined)
    //Patrón Decorator
    listaCompra.get().log()
}//resetFormState