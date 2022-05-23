import React, { useEffect, useState } from 'react'
import useGenesis from '../Hooks/useGenesis'

export default function NFTcard({ contract, account, token, breed, changeBreed, selercted }) {

    const { secondsToString, claimToken } = useGenesis(contract, account, token);

    const [nftdata, setnftdata] = useState()
    const [loandingNFT, setLoandingNFT] = useState(false)

    const [NFTInprocces, setNFTInprocces] = useState(false)
    const [NFTminPurity, setNFTminPurity] = useState()
    const [sow, setSow] = useState(true)

    const [seconds, setSeconds] = useState()
    const [time, setTime] = useState()

    const loadNFTData = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        const NFTimage = await contract.methods.tokenURI(tokenId).call()
        const NFTName = await contract.methods.getTokenName(tokenId).call()
        //const NFTTimeToClaim = await contract.methods.getTokenTimeToClaim(tokenId).call()
        if (NFTName != "InProcess") {
            const NFTBackground = await contract.methods.getTokenBackground(tokenId).call()
            const NFTBreeding = await contract.methods.getTokenBreeding(tokenId).call()
            const NFTColor = await contract.methods.getTokenColor(tokenId).call()
            const NFTNumber = await contract.methods.getTokenNumber(tokenId).call()
            const NFTPurity = await contract.methods.getTokenPurity(tokenId).call()
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
            let unix_timestamp = tokenTimeToClaim
            var date = new Date(unix_timestamp * 1000);
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

    useEffect(() => {
        loadNFTData()
    }, [])
    useEffect(() => {
        if (nftdata) {
            setLoandingNFT(true)
        }
    }, [nftdata])
    useEffect(() => {
        setTimeout(() => {
            if (seconds) {
                setSeconds(seconds - 1)
                setTime(secondsToString(seconds));
            }

        }, 1000);
    }, [seconds])
    useEffect(() => {
        loadNFTData()
    }, [changeBreed])


    return (
        <div>
            {
                sow ?
                    loandingNFT ?
                        !NFTInprocces ?
                            <div className={`card ${selercted ? selercted.includes(token + 1) ? "bg-red-900" : "bg-zinc-900" : "bg-zinc-900"} w-72 rounded-xl sm:m-4 p-6 space-y-4`}>
                                <img className="w-full rounded-md transition hover:bg-cyan-300"
                                    src={nftdata.img}
                                    alt="NFT" />
                                <div id="description" className="space-y-4">
                                    <h2 className="text-white font-semibold text-center text-xl transition hover:text-cyan-300">
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
                            <div className="card bg-zinc-900 w-72 rounded-xl sm:m-4 p-6 space-y-4">
                                <img className="w-full rounded-md transition hover:bg-cyan-300"
                                    src={nftdata.img}
                                    alt="NFT" />

                                {
                                    seconds > 0 ?
                                        <div id="description" className="space-y-4">
                                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500">
                                                <span id="price" className="text-white flex justify-center items-center">
                                                    {`${NFTminPurity} - ${parseInt(NFTminPurity) + 10}`}
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
                                            <div className="flex items-center justify-center font-semibold text-3xl border-slate-500">
                                                <span id="price" className="text-white flex justify-center items-center">
                                                    {`${NFTminPurity} - ${parseInt(NFTminPurity) + 10}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500">
                                                <button onClick={claimToken} className="bg-transparent hover:bg-cyan-500 text-cyan-300 font-semibold hover:text-white py-2 px-4 border border-cyan-300 hover:border-transparent rounded">
                                                    Claim
                                                </button>
                                            </div>
                                        </div>
                                }

                            </div>
                        :
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

                    <></>

            }



        </div >
    );
}

