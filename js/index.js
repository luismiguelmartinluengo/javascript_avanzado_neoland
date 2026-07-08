//@ts-check

//@ts-ignore - typscript no se lleva bien con rutas mapeadas, esto funciona, pasamos de typescript
import { ARTICLE_TYPES } from "classes/Article" //importación por las claves del import map
//@ts-ignore - typscript no se lleva bien con rutas mapeadas, esto funciona, pasamos de typescript
import { simpleFetch } from "utils/simpleFetch";


//Patron Factory + importación dinámica de ArticleFactoy
//Solo cuando se importe el módulo se instancia fabricaArticulos
//const fabricaArticulos = new ArticleFactory
//Con la importación dinámica se tiene que importar el módulo completo, no se puede
//importar de forma selectiva, pero se mejor el rendimiento (carga) de la página porque se 
//importa solo lo que se necesita y cuando se necesita
/** @import {Article, ArticleFactory} from  classes/Article.js*/
/** @import {ShoppingList} from classes/ShoppingList.js */
/** @type {ArticleFactory} */
let fabricaArticulos

import('./classes/Article.js').then((ModuloArticulo)=>{
    console.log(ModuloArticulo)
    fabricaArticulos = new ModuloArticulo.ArticleFactory
});

//Patron Singleton --> se declara crea lista compra en un método específico de setup que contine
//importaciones dinámicas de los módulos necesarios para la creación
/**  @type {ShoppingList} listaCompra */
let listaCompra



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

    getProducts()


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

function loadShoppingList(){
    
    if (listaCompra.get().basket.length > 0){
        for(let articulo of listaCompra.get().basket){
            addToElementsList(articulo)
        }//End for
    }//End if
}//End loadShoppingList

function setUpShoppingList(){
    //@ts-ignore
    Promise.all([
        //@ts-ignore
        import('classes/ShoppingList'),
        //@ts-ignore
        import('classes/LocalStore'),
        //@ts-ignore
        import('decorators/log')    
    ]).then((modules) => {
        const ShoppingList = modules[0].ShoppingList
        const withTotalMixin = modules[0].withTotalMixin
        const LocalStore = modules[1].LocalStore
        const logBasket = modules[2].logBasket

        listaCompra = (function(){

            function create(){
                const dataStore = new LocalStore('lista-compra')
                Object.assign(ShoppingList.prototype, withTotalMixin) //Esto añade la función de calculo de totales a objeto ShoppingList
                return new ShoppingList(dataStore)
            }//End create

            /**  @type {ShoppingList} shoppingListInstance */
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

        loadShoppingList()
        //Patron Observer
        listaCompra.get().subscribe('formulario', 'add', addToElementsList)
        listaCompra.get().subscribe('formulario', 'remove', removeFromElementsList)
    })//End Promise
}//End setUpShoppingList

function addToShoppingList(){
    const elementoNuevoArticulo = document.getElementById('articulo')
    let nuevoArticulo = (elementoNuevoArticulo instanceof HTMLInputElement)? elementoNuevoArticulo.value: ""
    const elementoQtyArticulo = document.getElementById('qut')
    let qtyArticulo = (elementoQtyArticulo instanceof HTMLInputElement)? elementoQtyArticulo.value: 1
    const elementoPrecioArticulo = document.getElementById('price')
    let precioArticulo = (elementoPrecioArticulo instanceof HTMLInputElement)? elementoPrecioArticulo.value: 0
    if(nuevoArticulo !== ''){
        const nuevoObjetoArticulo = fabricaArticulos.createTranslatedArticle(ARTICLE_TYPES.COMPLEX, nuevoArticulo, qtyArticulo, precioArticulo)
        listaCompra.get().addItem(nuevoObjetoArticulo) //Al estar suscrito el evento add de la ShoppingList, se ejecutará la función addToElementList ya que es el método callback pasado en la suscripción
    }//End if
}//End addToShoppingList

/** @param {Article} nuevoArticulo*/
function addToElementsList(nuevoArticulo){
    const listaArticulos = document.getElementById('lista')
    if (listaArticulos instanceof HTMLInputElement){
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
        boton.addEventListener('click', () => {removeFromShoppingList(nuevoArticulo)}, {once: true})
        elemento.appendChild(boton)
        listaArticulos.appendChild(elemento)
    }//End if
    resetFormState()
}//End addToElementsList

/** @param {Article} parArticulo*/
function removeFromShoppingList(parArticulo){
    listaCompra.get().removeItem(parArticulo) //Al estar suscrito al evento remove de la ShoppingList, se ejecutar la función removeFronElementList
}//End removeFromShoppingList

/** @param {Article} parArticulo*/
function removeFromElementsList(parArticulo){
    const listaArticulos = document.getElementById('lista')
    if (listaArticulos !== null){
        for (const node of listaArticulos.children){
            if (node.id === parArticulo.id){
                listaArticulos.removeChild(node)
            }//End if
        }//End for
        resetFormState()
    }//Emd if
}//End removeFromElementsList

function resetShoppingList(){
    const listaArticulos = document.getElementById('lista')
    listaCompra.get().emptyBasket()
    if (listaArticulos !== null){
        while (listaArticulos.lastElementChild){
            listaArticulos.lastElementChild.remove()
        }//End while
        resetFormState()
    }//End If
}//End resetShoppingList

function resetFormState(){
    const campoArticulo = document.getElementById('articulo')
    const campoQty = document.getElementById('qty')
    const campoPrecio = document.getElementById('price')    
    const botonArticulo = document.getElementById('nuevoArticulo')
    const totalLista = document.getElementById('total')
    const carrito = listaCompra.get()
    if (campoArticulo instanceof HTMLInputElement) campoArticulo.value = ''
    if (campoQty instanceof HTMLInputElement)  campoQty.value = "1"
    if (campoPrecio instanceof HTMLInputElement)     campoPrecio.value = "0"
    if (botonArticulo instanceof HTMLButtonElement) botonArticulo.setAttribute('disabled', "true")
    if (totalLista instanceof HTMLSpanElement)    totalLista.innerText = `${carrito.getTotal()} €`
    //Patrón Decorator
    //lo descativo, no lo voy a usar
    //listaCompra.get().log()
}//resetFormState


function getProducts() {
    //Esta función recopila de una api (interna de pruebas) un listado de productos
    //que se cargarán en el datalist definido en el html y qeu a su vez alimenta
    //la lista desplegable de nuevo artículo
    //const productosURL = 'https://dummyjson.com/products' //url de prueba para conectar con una api remota
    const productsURL = 'api/articles.json' //api interna
    simpleFetch(productsURL).then((/** @type {Article[]} */ listaProductos) => {
        const dataListProductos = document.getElementById('productos')
        if (dataListProductos instanceof HTMLDataListElement){
            console.log(listaProductos) //muestra lo que se ha recuperado
            listaProductos.forEach((producto) => {
                const opcion = document.createElement('option')
                opcion.value = producto.name
                dataListProductos.appendChild(opcion)
            });
        }//End if
    })

}//End getProducts