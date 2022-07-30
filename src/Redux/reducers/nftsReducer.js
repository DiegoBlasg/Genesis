export const nftsReducer = (state = [], action) => {
    switch (action.type) {
        case '@nfts/sort_purity':
            return state.sort((a, b) => b.purity - a.purity)

        case '@nfts/sort_number':
            return state.sort((a, b) => b.tokenId - a.tokenId)

        case '@nfts/add':
            return [action.payload, ...state]

        case '@nfts/modify':
            return state.map(nft => {
                if (nft.tokenId == action.payload.tokenId) nft = action.payload
                return nft
            })

        case '@nfts/remove':
            return state.filter(nft => nft.tokenId != action.payload)

        case '@nfts/init':
            return action.payload

        case '@nfts/reset':
            return []

        default:
            return state
    }
}

