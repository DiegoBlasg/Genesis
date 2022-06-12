export const nftsReducer = (state = [], action) => {
    switch (action.type) {
        case '@nfts/sort_purity':
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
        case '@nfts/sort_number':
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

        case '@nfts/init':
            return action.payload

        default:
            return state
    }
}

