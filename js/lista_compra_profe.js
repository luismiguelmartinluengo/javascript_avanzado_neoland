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
    const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []
    if (listaCompra.length > 0){
        for(let articulo of listaCompra){
            addToElementList(articulo.name)
        }//End for
    }//End if
}//End loadShoppingList

function addToShoppingList(){
    const nuevoArticulo = document.getElementById('articulo').value

    if(nuevoArticulo !== ''){
        const listaCompra = JSON.parse(window.localStorage.getItem('lista-compra')) || []
        const nuevaListaCompra = [...listaCompra, {name:nuevoArticulo}]
        window.localStorage.setItem('lista-compra', JSON.stringify(nuevaListaCompra))
        addToElementList(nuevoArticulo)
    }//End if
}//End addToShoppingList

function addToElementList(nuevoArticulo){
    const listaArticulos = document.getElementById('lista')
    const elemento = document.createElement('li')
    elemento.innerText = nuevoArticulo
    listaArticulos.appendChild(elemento)
    resetFormState()
}//End addToElementList

function resetShoppingList(){
    const listaArticulos = document.getElementById('lista')
    window.localStorage.removeItem('lista-compra')
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
}//resetFormState