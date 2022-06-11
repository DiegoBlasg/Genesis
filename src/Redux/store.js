import { combineReducers, createStore } from 'redux'
import { nftsReducer } from './reducers/nftsReducer';
import { nftFilterReducer } from './reducers/nftFilterReducer';
import { dataReducer } from './reducers/dataReducer';
import { loandingReducer } from './reducers/loandingReducer';


const reducer = combineReducers({
    nfts: nftsReducer,
    filter: nftFilterReducer,
    data: dataReducer,
    loanding: loandingReducer
})

export const store = createStore(reducer)
