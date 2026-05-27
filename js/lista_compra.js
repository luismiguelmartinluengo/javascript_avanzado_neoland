const listaArticulos;
const campoArticulo;
const botonArticulo;
const botonNuevaLista;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

function getListaEnMemoria(){
    return JSON.parse(window.localStorage.getItem('lista-compra')) || []
}//End getListaEnMemoria

function updateListaArticulos(){
    const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []
    if (listaCompra.length > 0){
        for(let articulo of listaCompra){
            const elemento = document.createElement('li')
            elemento.innerText = articulo.nombre
            listaArticulos.appendChild(elemento)
        }//End for
    }//End if
}//End updateListArticulos

function addNuevoArticulo(_articulo){
    const nuevaListaCompra = [...getListaEnMemoria(), {nombre: campoArticulo.value}]
    window.localStorage.setItem('lista-compra', JSON.stringify(nuevaListaCompra))
    const elemento = document.createElement('li')
    elemento.innerText = campoArticulo.value
    listaArticulos.appendChild(elemento)
    campoArticulo.value = ''
    botonArticulo.setAttribute('disabled', undefined)
}//End addNuevoArticulo

function resetFormulario(){
    campoArticulo.value = ''
    botonArticulo.disabled = true
    window.localStorage.removeItem('lista-compra')
    while (listaArticulos.children.length > 1){
        listaArticulos.lastElementChild.remove()
    }//End while
}//End resetFormulario

//Esto funciona como constructor
function onDOMContentLoaded(){
    formulario = document.getElementById('formulario')
    campoArticulo = document.getElementById('articulo')
    botonArticulo = document.getElementById('nuevoArticulo')
    botonNuevaLista = document.getElementById('nuevaLista')

    formulario.addEventListener('submit', onFormSubmit)
    campoArticulo.addEventListener('keyup', onInputKeyUp)
    botonArticulo.addEventListener('click', onNewArticleClick)
    botonNuevaLista.addEventListener('click', onNewListClick)

    updateListaArticulos()
}//End onDOMContentLoaded


function onFormSubmit(e){
    e.preventDefault()
}//End onFormSubmit

function onInputKeyUp(e){
    e.stopPropagation()
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
    if (campoArticulo.value !== ''){
        addNuevoArticulo(campoArticulo.value)
    }//End if
}//End onNewArticleClick

function onNewListClick(e){
    e.stopPropagation()
    resetFormulario()
}//End onNewListClick
