import React, { useEffect, useState } from 'react'
import NFTImage from '../NFTImage';
import useData from '../Hooks/useData';
import { useDispatch, useSelector } from 'react-redux';
import LeftCard from './LeftCard';
import RightCard from './RightCard';


export default function Breeding() {

    const { loadBlockchainData } = useData()
    const NFTs = useSelector(state => state.nfts)
    const { contract, wallet } = useSelector(state => state.data)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const [token1, setToken1] = useState();
    const [token2, setToken2] = useState();

    const [loandingBreed, setloandingBreed] = useState(false);

    const breed = async () => {
        setloandingBreed(true)
        const tokenId1 = await contract.methods.tokenOfOwnerByIndex(wallet, token1.tokenId - 1).call()
        const tokenId2 = await contract.methods.tokenOfOwnerByIndex(wallet, token2.tokenId - 1).call()
        contract.methods.breed(tokenId1, tokenId2).estimateGas({
            from: wallet,
            //value: window.web3.utils.toWei("10", "ether")
        }, function (error, gasAmount) {
            console.log(gasAmount);
            contract.methods.breed(tokenId1, tokenId2).send({
                from: wallet,
                //value: window.web3.utils.toWei("10", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.4),
            }, (err, hash) => { loadBlockchainData(); setloandingBreed(false) })
        });
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

        for (let i = NFTs.length - 1; i > 0; i--) {
            if (token1 && NFTs[i].tokenId == token1.tokenId) {
                setToken1(NFTs[i])
            }
            if (token2 && NFTs[i].tokenId == token2.tokenId) {
                setToken2(NFTs[i])
            }
        }

    }, [NFTs])

    return (
        <div>


            <div className='flex justify-center py-5 pb-0 sm:ml-24'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>BREEDING</h1>
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
            <div className="flex flex-wrap justify-center flex-col lg:flex-row items-center sm:ml-24">

                <LeftCard token2={token2} token1={token1} setToken1={setToken1} />

                <div className="p-11 hover:text-red-500 cursor-pointer" onClick={breed}>
                    {
                        loandingBreed ?
                            <div className='flex justify-center w-16 items-center text-cyan-300'>
                                <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    viewBox="0 0 100 100" enableBackground="new 0 0 0 0" >
                                    <circle fill="none" stroke="#000" strokeWidth="4" cx="50" cy="50" r="44" style={{ opacity: "0.5" }} />
                                    <circle fill="#67e8f9" stroke="#06b6d4" strokeWidth="3" cx="8" cy="54" r="6" >
                                        <animateTransform
                                            attributeName="transform"
                                            dur="2s"
                                            type="rotate"
                                            from="0 50 48"
                                            to="360 50 52"
                                            repeatCount="indefinite" />

                                    </circle>
                                </svg>
                            </div>
                            :
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-heart-half" viewBox="0 0 16 16">
                                    <path d="M8 2.748v11.047c3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                                <h1 className='font-bold text-center'>BREED</h1>
                            </div>
                    }


                </div>
                <RightCard token1={token1} token2={token2} setToken2={setToken2} />


            </div>
        </div >
    );
}


