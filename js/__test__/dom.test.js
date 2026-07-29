import { getInputValue, setInputValue } from '../index_redux.js'

test ('Crear input y asignar valor', ()=>{
    const elementoInput = document.createElement('input')
    setInputValue(elementoInput, 'x')
    expect(elementoInput.value).toBe('x')
})//End test

test ('Recuperar valor de input', ()=> {
    const elementoInput = document.createElement('input')
    setInputValue(elementoInput, 'x')
    expect(getInputValue(elementoInput)).toBe('x')
})//End test