export const nftFilterReducer = (state = 'all', action) => {
    if (action.type === '@filter/all') {
        return 'all'
    }
    return state
}

