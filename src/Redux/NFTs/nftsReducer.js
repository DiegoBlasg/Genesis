export const nftsReducer = (state = [], action) => {
    if (action.type === '@nfts/modified') {
        return state
    }
    if (action.type === '@nfts/init') {
        return action.payload
    }
    return state
}

