import { ARTICLE_TYPES, ArticleFactory } from "classes/Article" //importación por las claves del import map
import { ShoppingList, withTotalMixin } from "classes/ShoppingList"
import { LocalStore } from "classes/LocalStore"
import { logBasket } from "decorators/log"

//Patron Factory + importación dinámica de ArticleFactoy
//Solo cuando se importe el módulo se instancia fabricaArticulos
//const fabricaArticulos = new ArticleFactory
let fabricaArticulos
import('classes/Article').then((ModuloArticulo)=>{
    console.log(ModuloArticulo)
    fabricaArticulos = new ModuloArticulo.ArticleFactory
});

//Patron Singleton
let listaCompra = (function(){

    function create(){
        const dataStore = new LocalStore('lista-compra')
        Object.assign(ShoppingList.prototype, withTotalMixin) //Esto añade la función de calculo de totales a objeto ShoppingList
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
    const qtyArticulo = document.getElementById('qty').value || 1
    const precioArticulo = document.getElementById('price').value || 0
    if(nuevoArticulo !== ''){
        const nuevoObjetoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.COMPLEX, nuevoArticulo, qtyArticulo, precioArticulo)
        listaCompra.get().addItem(nuevoObjetoArticulo) //Al estar suscrito el evento add de la ShoppingList, se ejecutará la función addToElementList ya que es el método callback pasado en la suscripción
    }//End if
}//End addToShoppingList

function addToElementsList(nuevoArticulo){
    const listaArticulos = document.getElementById('lista')
    const elemento = document.createElement('li')
    const boton = document.createElement('button')
    let elementText = nuevoArticulo.name
    if (nuevoArticulo?.qty > 0) {
        elementText = `${elementText} x ${nuevoArticulo.qty}`
    }//End if
    if (nuevoArticulo?.price> 0) {
        elementText = `${elementText} @ ${nuevoArticulo.price}`
    }//End if
    elemento.innerText = elementText
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
    const listaArticulos = document.getElementById('lista')
    for (const node of listaArticulos.children){
        if (node.id === parArticulo.id){
            listaArticulos.removeChild(node)
        }//End if
    }//End for
    resetFormState()
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
    const campoQty = document.getElementById('qty')
    const campoPrecio = document.getElementById('price')    
    const botonArticulo = document.getElementById('nuevoArticulo')
    const totalLista = document.getElementById('total')
    const carrito = listaCompra.get()
    campoArticulo.value = ''
    campoQty.value = 1
    campoPrecio.value = 0
    botonArticulo.setAttribute('disabled', undefined)
    totalLista.innerText = `${carrito.getTotal()} €`
    //Patrón Decorator
    //lo descativo, no lo voy a usar
    //listaCompra.get().log()
}//resetFormState