import {getDataFromLocalStorage, updateLocalStorage} from '../index_redux.js'

beforeEach(() => {
    localStorage.clear()
})

afterEach(()=>{
    localStorage.clear()
})

test ('getDataFromLocalStorage returns expected value', ()=>{
    const expectedValue = { articles: []}
    localStorage.setItem("shoppingList", JSON.stringify(expectedValue))
    const result = getDataFromLocalStorage()
    expect(result).toEqual(expectedValue)
})//End test

test ('updateLocalStorage updates localStorage', () => {
    const newValue = { articles: [] }
    updateLocalStorage(newValue)
    const result = JSON.parse(localStorage.getItem('shoppingList'))
    expect(result).toEqual(newValue)
})//End test