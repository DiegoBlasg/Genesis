import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useData from './Hooks/useData'
import useNFTs from './Hooks/useNFTs'

export default function NFTImage({ nftdata }) {
    const { loadBlockchainData } = useData()
    const { contract, wallet } = useSelector(state => state.data)
    const { modifyNFT } = useNFTs()

    const [seconds, setSeconds] = useState()
    const [time, setTime] = useState()
    const [sowInfo, setSowInfo] = useState(false)
    const dispatch = useDispatch()

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
            const tokenId = nftdata.tokenId - 1
            const NFTName = await contract.methods.getTokenName(tokenId).call()
            if (NFTName != "InProcess") {
                clearTimeout(time)
                modifyNFT(tokenId, contract)
            }
        }, 1000);
    }

    const claimToken = async () => {
        const tokenId = nftdata.tokenId - 1
        contract.methods.claimNFT(tokenId).estimateGas({
            from: wallet,
            value: window.web3.utils.toWei("0.2", "ether")
        }, function (error, gasAmount) {
            contract.methods.claimNFT(tokenId).send({
                from: wallet,
                value: window.web3.utils.toWei("0.2", "ether"),
                gas: gasAmount,
            }).then(climedToken)
        });
    }

    useEffect(() => {
        let time = setTimeout(() => {
            if (seconds) {
                setSeconds(seconds - 1)
                setTime(secondsToString(seconds));
            }
            if (seconds <= 0) {
                clearTimeout(time)
                if (!nftdata.purity) modifyNFT(nftdata.tokenId - 1, contract, true)
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
                    <div className="card bg-zinc-900 w-72 rounded-xl my-4 sm:mx-4 p-6 space-y-4">
                        <img className="w-full rounded-md transition hover:bg-cyan-300"
                            src={nftdata.img}
                            alt="NFT" />
                        {
                            nftdata.purity == 100 ?
                                <div className="space-y-4">
                                    <h2 className='text-cyan-300 font-semibold text-center text-xl transition'>
                                        Criature #{nftdata.tokenId}
                                    </h2>
                                    <div className="flex items-center justify-center py-4 font-semibold text-sm border-slate-500">
                                        <h2 className='text-cyan-600 font-semibold text-center text-xl transition'>
                                            Top #{nftdata.winnersPosition}
                                        </h2>
                                    </div>
                                </div>
                                :
                                <div className="space-y-4">
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
                        }

                    </div>
                    :
                    <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4">
                        {
                            sowInfo ?
                                <div style={{ height: "282px" }} className="flex flex-col justify-center align-middle">
                                    <div className='mx-auto text-cyan-300'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" className="bi bi-incognito" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205a1.032 1.032 0 0 0-.014-.058l-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5c-.62 0-1.411-.136-2.025-.267-.541-.115-1.093.2-1.239.735Zm.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a29.58 29.58 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274ZM3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Zm-1.5.5c0-.175.03-.344.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085c.055.156.085.325.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0v-1Zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Z" />
                                        </svg>
                                    </div>

                                    <h1 className='text-center text-3xl m-4 cursor-default' style={{ textShadow: "0 0 10px #67e8f9", color: "transparent" }}
                                        onMouseOver={(e) => { e.target.style.color = "#67e8f9"; e.target.style.textShadow = "0 0 0" }}
                                        onMouseOut={(e) => { e.target.style.color = "transparent"; e.target.style.textShadow = "0 0 10px #67e8f9" }}>{nftdata.color}</h1>
                                    <h1 className='text-center text-3xl m-4 cursor-default' style={{ textShadow: "0 0 10px #67e8f9", color: "transparent" }}
                                        onMouseOver={(e) => { e.target.style.color = "#67e8f9"; e.target.style.textShadow = "0 0 0" }}
                                        onMouseOut={(e) => { e.target.style.color = "transparent"; e.target.style.textShadow = "0 0 10px #67e8f9" }}>{nftdata.purity}</h1>
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

