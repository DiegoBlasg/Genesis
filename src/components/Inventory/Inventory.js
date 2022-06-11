import React, { useContext, useEffect, useState } from 'react'
import Web3 from 'web3'
import NFT from '../../abis/NFT.json'
import NFTImage from '../NFTImage';
import { useDispatch, useSelector } from "react-redux";
import useData from '../Hooks/useData';

export default function Inventory() {
    const { contract, totalSuply, wallet } = useSelector(state => state.data)
    const NFTdata = useSelector(state => state.nfts)
    const { loadBlockchainData } = useData()

    const [sortByNumber, setsortByNumber] = useState(true);

    const mint = async () => {
        contract.methods.safeMint(wallet).estimateGas({
            from: wallet,
            //value: window.web3.utils.toWei("10", "ether")
        }, function (error, gasAmount) {
            console.log(gasAmount);
            contract.methods.safeMint(wallet).send({
                from: wallet,
                //value: window.web3.utils.toWei("10", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.3),
            }, (err, hash) => loadBlockchainData())
        });
    }
    return (
        <div>
            <div className='flex justify-center py-5 pb-0 sm:ml-24'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>INVENTORY</h1>
                </div>
            </div >
            <div className="flex flex-wrap sm:ml-24 justify-center">

                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => setsortByNumber(true)}>
                    <div className={`card ${sortByNumber ? "bg-teal-600" : "bg-zinc-900"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>NUMBER</h1>
                    </div>
                </div >
                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => setsortByNumber(false)}>
                    <div className={`card ${sortByNumber ? "bg-zinc-900" : "bg-teal-600"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>PURITY</h1>
                    </div>
                </div >
            </div>


            <div className="flex flex-wrap justify-center sm:ml-24">

                <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 pt-32 cursor-pointer" onClick={() => mint()}>
                    <div className='flex justify-center items-center p-6 text-cyan-300'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                        </svg>
                    </div>

                    <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 pb-24">
                        <span id="price" className="text-cyan-300 flex justify-between items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" viewBox="0 0 320 512" fill="#67E7F9">
                                <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z" />
                            </svg>
                            10 ETH
                        </span>
                    </div>
                </div>

                {
                    NFTdata.map((_, i) => (
                        <div key={_.id}>
                            < NFTImage token={_.id} contract={contract} account={wallet}></NFTImage>
                        </div>
                    ))
                }

            </div>
        </div >
    );
}


