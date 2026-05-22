document.addEventListener('DOMContentLoaded', onDOMContentLoaded)

//Esto funciona como constructor
function onDOMContentLoaded(){
    const listaArticulos = document.getElementById('lista')
    const formulario = document.getElementById('formulario')
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    const botonNuevaLista = document.getElementById('nuevaLista')
    //Se recupera la lista de la compra que haya almacenada en la memoria
    const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []

    formulario.addEventListener('submit', onFormSubmit)
    campoArticulo.addEventListener('keyup', onInputKeyUp)
    botonArticulo.addEventListener('click', onNewArticleClick)
    botonNuevaLista.addEventListener('click', onNewListClick)

    //Si había lista de la compra almacenada en memoria, se muestra
    if (listaCompra.length > 0){
        for(let articulo of listaCompra){
            const elemento = document.createElement('li')
            elemento.innerText = articulo.nombre
            listaArticulos.appendChild(elemento)

        }//End for
    }//End if
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
    const listaArticulos = document.getElementById('lista')
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []

    if (campoArticulo.value !== ''){
        const nuevaListaCompra = [...listaCompra, {nombre: campoArticulo.value}]
        window.localStorage.setItem('lista-compra', JSON.stringify(nuevaListaCompra))
        const elemento = document.createElement('li')
        elemento.innerText = campoArticulo.value
        listaArticulos.appendChild(elemento)
        campoArticulo.value = ''
        botonArticulo.setAttribute('disabled', undefined)
    }//End if


}//End onNewArticleClick

function onNewListClick(e){
    console.log('entra')
    e.stopPropagation()
    const listaArticulos = document.getElementById('lista')
    const campoArticulo = document.getElementById('articulo')
    const botonArticulo = document.getElementById('nuevoArticulo')
    campoArticulo.value = ''
    botonArticulo.disabled = true
    window.localStorage.removeItem('lista-compra')
    while (listaArticulos.children.length > 1){
        listaArticulos.lastElementChild.remove()
    }//End while
}//End onNewListClick
