import React, { useEffect, useState } from 'react'
import useData from '../Hooks/useData';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import LeftCard from './LeftCard';
import RightCard from './RightCard';


const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '30%',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#18181b',
        border: '0',
        overflow: 'auto'
    },
    overlay: {
        backgroundColor: 'rgba(100, 100, 100, 0.75)'
    }
};
Modal.setAppElement('#root');
const Craft = () => {

    const { loadBlockchainData } = useData()
    const NFTs = useSelector(state => state.nfts)
    const { contract, wallet } = useSelector(state => state.data)
    const filter = useSelector(state => state.filter)
    const dispatch = useDispatch()

    const [token1, setToken1] = useState();
    const [token2, setToken2] = useState();

    const [loandingCraft, setloandingCraft] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const craft = async () => {
        setloandingCraft(true)
        const tokenId1 = token1.tokenId - 1
        const tokenId2 = token2.tokenId - 1
        console.log(tokenId1);
        console.log(tokenId2);
        contract.methods.craft(tokenId1, tokenId2).estimateGas({
            from: wallet,
            //value: window.web3.utils.toWei("10", "ether")
        }, function (err, gasAmount) {
            console.log(gasAmount);
            contract.methods.craft(tokenId1, tokenId2).send({
                from: wallet,
                //value: window.web3.utils.toWei("10", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.4),
            }, (err, hash) => {
                loadBlockchainData();
                setloandingCraft(false);
                setToken1(undefined);
                setToken2(undefined);
                closeModal()
            })
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
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                closeTimeoutMS={100}
            >
                {token1 && token2 &&
                    <div>
                        <div className='flex justify-between'>
                            <div className='text-zinc-100 cursor-pointer absolute top-5 right-5 spy-5' onClick={closeModal}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" ame="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                                    <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                                </svg>
                            </div>

                            <div className="mx-auto">
                                <h1 className='text-zinc-100 text-center font-bold text-3xl'>PREVIEW</h1>
                            </div>

                        </div>
                        <div className="w-64 mx-2 my-4 p-6 space-y-4">
                            <img className="w-full rounded-md transition"
                                src={`./NFTs/${token2.color}.png`}
                                alt="NFT" />
                            <div id="description" className="space-y-4">
                                <h2 className="text-white hover:text-cyan-300 font-semibold text-center text-xl transition">
                                    Criature #?
                                </h2>
                                <div className="flex items-center justify-between font-semibold text-sm border-slate-500">
                                    <span id="price" className="text-cyan-300 flex justify-between items-center">
                                        <span className='text-cyan-600'>Breeding&nbsp;</span>
                                        {parseInt(token1.breeding) + parseInt(token2.breeding) > 4 ? 4 : parseInt(token1.breeding) + parseInt(token2.breeding)}/4
                                    </span>
                                    <span id="price" className="text-cyan-300 flex justify-between items-center">
                                        <span className='text-cyan-600'>Purity&nbsp;</span>
                                        {token1.purity > token2.purity ?
                                            `${token1.purity} - ${token2.purity}`
                                            :
                                            token1.purity < token2.purity ?
                                                `${token2.purity} - ${token1.purity}`
                                                :
                                                token1.purity
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center justify-between font-semibold text-sm border-slate-500">
                                    <span id="price" className="text-cyan-300 flex justify-between items-center">
                                        <span className='text-cyan-600'>Color&nbsp;</span> {token2.color}
                                    </span>
                                    <span id="price" className="text-cyan-300 flex justify-between items-center">
                                        <span className='text-cyan-600'>Background&nbsp;</span> {token1.bg}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                }


            </Modal >
            <div className='flex justify-center py-5 pb-0 sm:ml-24'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>CRAFTING</h1>
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

                <div className="p-11 hover:text-red-500">
                    {
                        loandingCraft ?
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
                            <div className='cursor-pointer' onClick={() => { openModal(); craft() }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                                    <path d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                                </svg>
                                <h1 className='font-bold text-center'>CRAFT</h1>
                            </div>
                    }


                </div>
                <RightCard token1={token1} token2={token2} setToken2={setToken2} />


            </div>
        </div >
    );
}

export default Craft


