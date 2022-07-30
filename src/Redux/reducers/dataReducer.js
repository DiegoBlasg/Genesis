export const dataReducer = (state = {}, action) => {
    if (action.type === '@data/init') {
        return action.payload
    }
    if (action.type === '@data/reset') {
        state = {}
    }
    if (action.type === '@data/modifyTotalSupply') {
        state.totalSupply = action.payload
    }
    return state
}

