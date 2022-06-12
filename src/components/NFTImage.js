import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useData from './Hooks/useData'

export default function NFTImage({ nftdata }) {
    const { loadBlockchainData } = useData()
    const { contract, wallet } = useSelector(state => state.data)

    const [seconds, setSeconds] = useState()
    const [time, setTime] = useState()
    const [sowInfo, setSowInfo] = useState(false)

    const secondsToString = (seconds) => {
        var hour = Math.floor(seconds / 3600);
        hour = (hour < 10) ? '0' + hour : hour;
        var minute = Math.floor((seconds / 60) % 60);
        minute = (minute < 10) ? '0' + minute : minute;
        var second = seconds % 60;
        second = (second < 10) ? '0' + second : second;
        return hour + ':' + minute + ':' + second;
    }

    const climedToken = async () => {
        let time = setTimeout(async () => {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, nftdata.tokenId - 1).call()
            const NFTName = await contract.methods.getTokenName(tokenId).call()
            if (NFTName != "InProcess") {
                clearTimeout(time)
                loadBlockchainData()
            }
        }, 1000);
    }

    const claimToken = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, nftdata.tokenId - 1).call()
        contract.methods.claimNFT(tokenId).send({
            from: wallet,
            gas: 400000
        }, (err, hash) => { climedToken() })
    }

    useEffect(() => {
        let time = setTimeout(() => {
            if (seconds) {
                setSeconds(seconds - 1)
                setTime(secondsToString(seconds));
            }
            if (seconds <= 0) {
                clearTimeout(time)
            }

        }, 1000);
    }, [seconds])

    useEffect(() => {
        const now = new Date()
        const secondsToClimb = Math.trunc(((nftdata.dateToClimb - now) / 1000));
        if (secondsToClimb > 0) {
            setSeconds(secondsToClimb)
        } else {
            setSeconds(0)
        }
    }, [])

    return (
        <div>
            {
                !nftdata.inProcess ?
                    <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4">
                        <img className="w-full rounded-md transition hover:bg-cyan-300"
                            src={nftdata.img}
                            alt="NFT" />
                        <div id="description" className="space-y-4">
                            <h2 className={`${nftdata.breeding == 0 ? 'text-red-700 hover:text-red-500' : 'text-white hover:text-cyan-300'} font-semibold text-center text-xl transition`}>
                                Criature #{nftdata.tokenId}
                            </h2>
                            <div className="flex items-center justify-between font-semibold text-sm border-slate-500">
                                <span id="price" className="text-cyan-300 flex justify-between items-center">
                                    <span className='text-cyan-600'>Breeding&nbsp;</span> {nftdata.breeding}/4
                                </span>
                                <span id="price" className="text-cyan-300 flex justify-between items-center">
                                    <span className='text-cyan-600'>Purity&nbsp;</span> {nftdata.purity}
                                </span>
                            </div>
                            <div className="flex items-center justify-between font-semibold text-sm border-slate-500">
                                <span id="price" className="text-cyan-300 flex justify-between items-center">
                                    <span className='text-cyan-600'>Color&nbsp;</span> {nftdata.color}
                                </span>
                                <span id="price" className="text-cyan-300 flex justify-between items-center">
                                    <span className='text-cyan-600'>Background&nbsp;</span> {nftdata.bg}
                                </span>
                            </div>
                        </div>

                    </div>
                    :
                    <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4">
                        {
                            sowInfo ?
                                <div style={{ height: "282px" }} className="flex flex-col justify-center align-middle">
                                    <h1 className='text-center text-3xl text-cyan-300 m-4'>{nftdata.color}</h1>
                                    <h1 className='text-center text-3xl text-cyan-300 m-4'>{nftdata.purity}</h1>
                                </div>
                                :
                                <img className="w-full rounded-md transition hover:bg-cyan-300"
                                    src={nftdata.img}
                                    alt="NFT" />

                        }

                        {
                            seconds > 0 ?
                                <div id="description" className="space-y-4">
                                    <div className="flex items-center justify-center font-semibold text-2xl border-slate-500">
                                        <span id="price" className="text-white flex justify-center items-center">
                                            {`${nftdata.minPurity} - ${parseInt(nftdata.minPurity) + 10}`}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center font-semibold text-3xl py-2 border-slate-500">
                                        <span id="price" className="text-cyan-300 flex justify-center items-center">
                                            {time ? time : "--:--:--"}
                                        </span>
                                    </div>
                                </div>
                                :
                                <div id="description" className="space-y-4">
                                    <div className="flex items-center justify-between font-semibold text-3xl border-slate-500">

                                        <div style={{ width: "25px", height: "25px" }}></div>
                                        <span id="price" className="text-white flex justify-center items-center">
                                            {`${nftdata.minPurity} - ${parseInt(nftdata.minPurity) + 10}`}
                                        </span>
                                        <div className="text-white cursor-pointer" onClick={() => setSowInfo(!sowInfo)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                            </svg>
                                        </div>

                                    </div>
                                    <div className="flex items-center justify-center font-semibold text-2xl border-slate-500">
                                        <button onClick={claimToken} className="bg-transparent hover:bg-cyan-500 text-cyan-300 font-semibold hover:text-white py-2 px-4 border border-cyan-300 hover:border-transparent rounded">
                                            Claim
                                        </button>
                                    </div>
                                </div>
                        }

                    </div>
            }



        </div >
    );
}

