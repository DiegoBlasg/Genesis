export const loandingReducer = (state = true, action) => {
    if (action.type === '@loanding/change') {
        return action.payload
    }
    return state
}