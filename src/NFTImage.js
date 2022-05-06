import './App.css';
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function NFTImage({ contract, account, token }) {
    const [nftdata, setnftdata] = useState()
    const [loandingNFT, setLoandingNFT] = useState(false)
    const loadNFTData = async () => {
        const tokenId = await contract.methods.tokenOfOwnerByIndex(account, token).call()
        const NFTjson = await contract.methods.tokenURI(tokenId).call()
        const tokenNumber = await contract.methods.getTokenNumber(tokenId).call()
        const tokenBreeding = await contract.methods.getTokenBreeding(tokenId).call()
        const data = await axios.get(NFTjson)
        setnftdata({
            img: data.data.image,
            bg: data.data.attributes[2].value,
            color: data.data.attributes[1].value,
            purity: data.data.attributes[0].value,
            tokenId: tokenNumber,
            breeding: tokenBreeding
        })
    }

    useEffect(() => {
        loadNFTData()
    }, [])
    useEffect(() => {
        if (nftdata) {
            setLoandingNFT(true)
        }
        console.log(nftdata);
    }, [nftdata])


    return (
        <div>
            {
                loandingNFT ?
                    <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4">
                        <a href="#">
                            <img className="w-full rounded-md transition hover:bg-cyan-300"
                                src={nftdata.img}
                                alt="NFT" />
                        </a>
                        <div id="description" className="space-y-4">
                            <h2 className="text-white font-semibold text-center text-xl transition hover:text-cyan-300">
                                Criature #{nftdata.tokenId}
                            </h2>
                            <div className="flex items-center justify-between font-semibold text-sm border-slate-500">
                                <span id="price" className="text-cyan-300 flex justify-between items-center">
                                    <span className='text-cyan-600'>Breeding&nbsp;</span> {nftdata.breeding}/6
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
                    <div className="card bg-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 pt-32 cursor-pointer">
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

                        <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 pb-24">
                            <span id="price" className="text-cyan-300 flex items-center">
                                Loanding...
                            </span>
                        </div>
                    </div>

            }



        </div>
    );
}

