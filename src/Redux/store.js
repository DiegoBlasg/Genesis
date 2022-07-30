import { combineReducers, createStore } from 'redux'
import { nftsReducer } from './reducers/nftsReducer';
import { nftFilterReducer } from './reducers/nftFilterReducer';
import { dataReducer } from './reducers/dataReducer';
import { loandingReducer } from './reducers/loandingReducer';
import { pageReducer } from './reducers/pageReducer';


const reducer = combineReducers({
    nfts: nftsReducer,
    filter: nftFilterReducer,
    data: dataReducer,
    loanding: loandingReducer,
    page: pageReducer
})

export const store = createStore(reducer)
