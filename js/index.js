const txtNuevoArticulo = document.getElementById('txtNuevoArticulo')
const btnAñadirArticulo = document.getElementById('btnAñadirArticulo')
const ulLista = document.getElementById('ulLista')

txtNuevoArticulo.addEventListener('input', onTxtNuevoArticuloInput)
btnAñadirArticulo.addEventListener('click', onBtnAñadirArticuloClick)


function onTxtNuevoArticuloInput(evento){
    btnAñadirArticulo.disabled = (evento.target.value.trim() === '')
}//End onTxtNuevoArticuloInput

function onBtnAñadirArticuloClick(evento){

}//End onBtnAñadirArticuloClick

btnAñadirArticulo.disabled = true