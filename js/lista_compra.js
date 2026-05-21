const txtNuevoArticulo = document.getElementById('txtNuevoArticulo')
const btnAñadirArticulo = document.getElementById('btnAñadirArticulo')
const ulLista = document.getElementById('ulLista')
const articulosEnLista = []

txtNuevoArticulo.addEventListener('input', onTxtNuevoArticuloInput)
btnAñadirArticulo.addEventListener('click', onBtnAñadirArticuloClick)


function onTxtNuevoArticuloInput(evento){
    btnAñadirArticulo.disabled = (evento.target.value.trim() === '')
}//End onTxtNuevoArticuloInput

function onBtnAñadirArticuloClick(evento){
    let valorNuevoArticulo = txtNuevoArticulo.value
    if (valorNuevoArticulo.length > 0) {
        if (!articulosEnLista.includes(valorNuevoArticulo)){
            articulosEnLista.push(valorNuevoArticulo)
            console.log(articulosEnLista)
            localStorage.setItem('listaCompra', JSON.stringify(articulosEnLista))
            let liNuevoArticulo = document.createElement('li')
            liNuevoArticulo.textContent = valorNuevoArticulo
            ulLista.appendChild(liNuevoArticulo)
        }//End if
        txtNuevoArticulo.value = ""
        btnAñadirArticulo.disabled = true
    }//End if
    
}//End onBtnAñadirArticuloClick
