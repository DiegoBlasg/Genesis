import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

export default function NFTImage({ nftdata }) {
    const [sowInfo, setSowInfo] = useState(false)
    const { contract, wallet } = useSelector(state => state.data)
    /*const [nftdata, setnftdata] = useState()
    const [loandingNFT, setLoandingNFT] = useState(false)

    const [NFTInprocces, setNFTInprocces] = useState(false)
    const [NFTminPurity, setNFTminPurity] = useState()
    const [sow, setSow] = useState(true)

    const [breed0, setBreed0] = useState(false)

    const [infoToken, setInfoToken] = useState({})

    
    const loadNFTData = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        const NFTimage = await contract.methods.tokenURI(tokenId).call()
        const NFTName = await contract.methods.getTokenName(tokenId).call()
        if (NFTName != "InProcess") {
            const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
            const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
            const NFTColor = await contract.methods.getTokenColor(tokenId).call()
            const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
            const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
            if (NFTBreeding == 0) setBreed0(true)
            setnftdata({
                img: NFTimage,
                bg: NFTBackground,
                color: NFTColor,
                purity: NFTPurity,
                tokenId: NFTNumber,
                breeding: NFTBreeding
            })
        } else {
            if (breed) setSow(false)
            setNFTInprocces(true)
            const minPurity = await contract.methods.getMinPurity(tokenId).call();
            setNFTminPurity(minPurity)
            const tokenTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call();
            var date = new Date(tokenTimeToClaim * 1000);
            var now = new Date()
            var c = Math.trunc(((date - now) / 1000));
            if (c > 0) {
                setSeconds(c)
            }

            setnftdata({
                img: NFTimage,
            })
        }
    }


    const claimToken = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        contract.methods.claimNFT(tokenId).send({ from: account, gas: 400000 }, (err, hash) => { setLoandingNFT(false); setNFTInprocces(false); climedToken() })
    }
    const sowTokenInfo = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        const NFTTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call()
        const date = new Date(NFTTimeToClaim * 1000);
        const now = new Date()
        if (date < now) {
            const NFTColor = await contract.methods.getTokenColor(tokenId).call()
            const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
            setInfoToken({ color: NFTColor, purity: NFTPurity })
        }


    }

    useEffect(() => {
        sowTokenInfo()
    }, [sowInfo])
    useEffect(() => {
        loadNFTData()
    }, [])
    useEffect(() => {
        if (nftdata) {
            setLoandingNFT(true)
        }
    }, [nftdata])
    useEffect(() => {
        loadNFTData()
    }, [changeBreed])*/
    const claimToken = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(wallet, nftdata.tokenId - 1).call()
        contract.methods.claimNFT(tokenId).send({
            from: wallet,
            gas: 400000
        }, (err, hash) => { climedToken() })
    }
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
                console.log("refress");
            }
        }, 1000);
    }
    const [seconds, setSeconds] = useState()
    const [time, setTime] = useState()
    useEffect(() => {
        setTimeout(() => {
            if (seconds) {
                setSeconds(seconds - 1)
                setTime(secondsToString(seconds));
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
                /*:
                <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 pt-16  cursor-pointer">
                    <div className='flex justify-center items-center p-6 text-cyan-300'>
                        <svg version="1.1" id="L3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                            viewBox="0 0 100 100" enableBackground="new 0 0 0 0" >
                            <circle fill="none" stroke="#fff" strokeWidth="4" cx="50" cy="50" r="44" style={{ opacity: "0.5" }} />
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

                    <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 pb-16">
                        <span id="price" className="text-cyan-300 flex items-center">
                            Loanding...
                        </span>
                    </div>
                </div>
            :

            <></>*/

            }



        </div >
    );
}

