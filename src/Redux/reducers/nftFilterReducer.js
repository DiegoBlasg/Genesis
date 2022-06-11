export const nftFilterReducer = (state = 'number', action) => {
    if (action.type === '@filter/number') {
        return 'number'
    }
    if (action.type === '@filter/purity') {
        return 'purity'
    }
    return state
}

