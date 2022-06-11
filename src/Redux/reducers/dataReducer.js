export const dataReducer = (state = {}, action) => {
    if (action.type === '@data/init') {
        return action.payload
    }
    return state
}

