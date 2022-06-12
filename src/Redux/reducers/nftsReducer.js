export const nftsReducer = (state = [], action) => {
    if (action.type === '@nfts/sort_purity') {
        for (let i = state.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(state[j].purity) < parseInt(state[j + 1].purity)) {
                    let value = state[j];
                    state[j] = state[j + 1];
                    state[j + 1] = value;
                }
            }
        }
        return state
    }
    if (action.type === '@nfts/sort_number') {
        for (let i = state.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(state[j].tokenId) < parseInt(state[j + 1].tokenId)) {
                    let value = state[j];
                    state[j] = state[j + 1];
                    state[j + 1] = value;
                }
            }
        }
        return state
    }
    if (action.type === '@nfts/init') {
        return action.payload
    }
    return state
}

