export const pageReducer = (state = 1, action) => {
    if (action.type === '@page/add') {
        return state + 1
    }
    if (action.type === '@page/substract') {
        return state - 1
    }
    if (action.type === '@page/set') {
        return action.payload
    }
    return state
}

