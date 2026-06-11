import { ARTICLE_TYPES } from "classes/Article" //importación por las claves del import map
import { simpleFetch } from "./utils/simpleFetch.js";


//Patron Factory + importación dinámica de ArticleFactoy
//Solo cuando se importe el módulo se instancia fabricaArticulos
//const fabricaArticulos = new ArticleFactory
//Con la importación dinámica se tiene que importar el módulo completo, no se puede
//importar de forma selectiva, pero se mejor el rendimiento (carga) de la página porque se 
//importa solo lo que se necesita y cuando se necesita
let fabricaArticulos
import('classes/Article').then((ModuloArticulo)=>{
    console.log(ModuloArticulo)
    fabricaArticulos = new ModuloArticulo.ArticleFactory
});

//Patron Singleton --> se declara crea lista compra en un método específico de setup que contine
//importaciones dinámicas de los módulos necesarios para la creación
let listaCompra



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

    getProducts()


    //Dynamic import --> llevamos la importación de módulos necesarios para Shoppinglist al momento en el que se crea listacompra
    setUpShoppingList()

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

function setUpShoppingList(){
    Promise.all([
        import('classes/ShoppingList'),
        import('classes/LocalStore'),
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


function getProducts() {
    //Esta función recopila de una api (interna de pruebas) un listado de productos
    //que se cargarán en el datalist definido en el html y qeu a su vez alimenta
    //la lista desplegable de nuevo artículo
    //const productosURL = 'https://dummyjson.com/products' //url de prueba para conectar con una api remota
    const productsURL = 'api/articles.json' //api interna
    simpleFetch(productsURL).then((listaProductos) => {
        const dataListProductos = document.getElementById('productos')
        console.log(listaProductos) //muestra lo que se ha recuperado
        listaProductos.forEach((producto) => {
            const opcion = document.createElement('option')
            opcion.value = producto.name
            dataListProductos.appendChild(opcion)
        });
    })

}//End getProducts