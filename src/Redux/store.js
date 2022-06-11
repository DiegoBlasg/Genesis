import { combineReducers, createStore } from 'redux'
import { nftsReducer } from './NFTs/nftsReducer';
import { nftFilterReducer } from './NFTFilter/nftFilterReducer';
import { dataReducer } from './Data/dataReducer';


const reducer = combineReducers({
    nfts: nftsReducer,
    filter: nftFilterReducer,
    data: dataReducer
})

export const store = createStore(reducer)
