

test ('sumar 1y 2 debería ser 3', ()=>{
    expect(suma(1, 2)).toBe(3)
})//end test


function suma(a, b){
    return a + b
}//End suma