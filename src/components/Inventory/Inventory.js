import NFTImage from '../NFTImage';
import { useDispatch, useSelector } from "react-redux";
import useData from '../Hooks/useData';
import useNFTs from '../Hooks/useNFTs';
import { useState } from 'react';
import { useEffect } from 'react';
import '../patterns.css'

export default function Inventory() {

    const { loadNFTData, getDataFromNewNFTs } = useNFTs()
    const dispatch = useDispatch()
    const { contract, wallet, totalSupply } = useSelector(state => state.data)
    const NFTdata = useSelector(state => state.nfts)
    const filter = useSelector(state => state.filter)
    const page = useSelector(state => state.page)
    const [loadingMint, setLoadingMint] = useState(false)
    const [totalPages, setTotalPages] = useState()

    const mint = async () => {
        setLoadingMint(true)
        contract.methods.safeMint(wallet).estimateGas({
            from: wallet,
            value: window.web3.utils.toWei("0.2", "ether")
        }, function (error, gasAmount) {
            contract.methods.safeMint(wallet).send({
                from: wallet,
                value: window.web3.utils.toWei("0.2", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.3),
            }, (err, hash) => { setLoadingMint(false); }).then(() => getDataFromNewNFTs(wallet, contract, totalSupply));
        })
    }

    const sortNftDataByNumber = () => {
        dispatch({
            type: '@nfts/sort_number'
        })
        dispatch({
            type: '@filter/number'
        })
    }
    const sortNftDataByPurity = () => {
        dispatch({
            type: '@nfts/sort_purity'
        })
        dispatch({
            type: '@filter/purity'
        })
    }
    useEffect(() => {
        totalSupply && setTotalPages(Math.ceil(totalSupply / 10))
    }, [totalSupply])
    return (
        <div>
            <div className='pattern-black fixed w-full h-full -z-10'></div>
            <div className='flex justify-center py-5 pb-0 sm:ml-24 pt-20 sm:pt-5'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>INVENTORY</h1>
                </div>
            </div >
            <div className="flex flex-wrap sm:ml-24 justify-center">

                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => sortNftDataByNumber()}>
                    <div className={`card ${filter === 'number' ? "bg-teal-600" : "bg-zinc-900"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>NUMBER</h1>
                    </div>
                </div >
                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => sortNftDataByPurity()}>
                    <div className={`card ${filter === 'purity' ? "bg-teal-600" : "bg-zinc-900"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>PURITY</h1>
                    </div>
                </div >
            </div>


            <div className="flex flex-wrap justify-center sm:ml-24">

                <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 pt-32 cursor-pointer pb-20" onClick={() => mint()}>
                    <div className='flex justify-center items-center p-6 text-cyan-300'>
                        {
                            loadingMint ?
                                <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" width="100" height="100" x="0px" y="0px"
                                    viewBox="-10 -10 120 120" enableBackground="new 0 0 0 0" >
                                    <circle fill="none" stroke="#fff" strokeWidth="6" cx="50" cy="50" r="44" style={{ opacity: "0.8" }} />
                                    <circle fill="#67e8f9" stroke="#06b6d4" strokeWidth="6" cx="8" cy="54" r="6" >
                                        <animateTransform
                                            attributeName="transform"
                                            dur="2s"
                                            type="rotate"
                                            from="0 50 48"
                                            to="360 50 52"
                                            repeatCount="indefinite" />

                                    </circle>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                                </svg>
                        }


                    </div>

                    <div className="flex flex-col items-center justify-center font-semibold text-2xl border-slate-500 pb-15">
                        <h1 className="text-cyan-300 flex justify-between items-center">
                            NEW NFT
                        </h1>
                        <h1 className="text-cyan-300 flex justify-between items-center mt-3">
                            1 - 10
                        </h1>
                    </div>
                </div>

                {
                    NFTdata.map((nft) => (
                        < NFTImage key={nft.tokenId} nftdata={nft} />
                    ))
                }

            </div>
            {
                totalPages > 1 &&
                <div className='flex justify-center sm:ml-24 my-12'>
                    <nav className=' shadow-zinc-500 shadow-lg'>
                        <ul className="inline-flex -space-x-px">
                            <li>
                                <span onClick={() => { page > 1 && dispatch({ type: '@page/substract' }); loadNFTData(contract, wallet, totalSupply, page) }}
                                    className="cursor-pointer bg-zinc-900 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-300 ml-0 rounded-l-lg leading-tight py-2 px-3">Previous</span>
                            </li>
                            {
                                totalPages &&
                                Array(totalPages).fill({}).map((a, i) => (
                                    <li key={i}>
                                        <span onClick={() => { page != i + 1 && dispatch({ type: '@page/set', payload: i + 1 }); loadNFTData(contract, wallet, totalSupply, page) }}
                                            className={`cursor-pointer ${page == (i + 1) ? 'bg-zinc-600' : 'bg-zinc-900'} border border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-300 leading-tight py-2 px-3`}>{i + 1}</span>
                                    </li>
                                ))
                            }
                            <li>
                                <span onClick={() => { page < totalPages && dispatch({ type: '@page/add' }); loadNFTData(contract, wallet, totalSupply, page) }}
                                    className="cursor-pointer bg-zinc-900 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:text-zinc-300 rounded-r-lg leading-tight py-2 px-3">Next</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            }


        </div >
    );
}