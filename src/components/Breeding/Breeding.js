import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import NFT from '../../abis/NFT.json'
import NFTImage from '../NFTImage';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: '30%',
        bottom: 'auto',
        marginRight: '-70%',
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

export default function Breeding() {

    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpen2, setIsOpen2] = useState(false);
    const [token1, setToken1] = useState();
    const [token2, setToken2] = useState();
    const [arrayOfIds2, setarrayOfIds2] = useState([]);

    const [changeBreed, setChangeBreed] = useState(false);
    const [sortByNumber, setsortByNumber] = useState(true);



    function openModal() {
        setIsOpen(true);
        setToken1(undefined)
    }

    function closeModal() {
        setIsOpen(false);
    }
    function openModal2() {
        setIsOpen2(true);
        setToken2(undefined)
    }

    function closeModal2() {
        setIsOpen2(false);
    }

    const [walletAccount, setWalletAccount] = useState();
    const [NFTcontract2, setNFTContract2] = useState();
    const [numberOfNFT, setNumberOfNFT] = useState();
    const [loanding, setloanding] = useState(false);
    const [loandingBreed, setloandingBreed] = useState(false);

    const breed = async () => {
        setloandingBreed(true)
        const tokenId1 = await NFTcontract2.methods.tokenOfOwnerByIndex(walletAccount, token1).call()
        const tokenId2 = await NFTcontract2.methods.tokenOfOwnerByIndex(walletAccount, token2).call()
        NFTcontract2.methods.breed(tokenId1, tokenId2).estimateGas({
            from: walletAccount,
            //value: window.web3.utils.toWei("10", "ether")
        }, function (error, gasAmount) {
            console.log(gasAmount);
            NFTcontract2.methods.breed(tokenId1, tokenId2).send({
                from: walletAccount,
                //value: window.web3.utils.toWei("10", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.4),
            }, (err, hash) => { loadBlockchainData(); setChangeBreed(!changeBreed); setloandingBreed(false) })
        });
    }

    const loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('¡Considera usar Metamask!')
        }

    }

    const loadBlockchainData = async () => {
        const web3 = window.web3
        // Cargar una cuenta
        const accounts = await web3.eth.getAccounts()
        setWalletAccount(accounts[0])
        const networkId = await web3.eth.net.getId()
        const networkData = NFT.networks[networkId]
        if (networkData) {
            const abi = NFT.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            setNFTContract2(contract)
            // Función 'totalSupply' del Smart Contract
            const totalSupply = await contract.methods.balanceOf(accounts[0]).call()
            setNumberOfNFT(totalSupply)

        } else {
            window.alert('¡Smart Contract no desplegado en la red!')
        }
    }

    useEffect(() => {
        loadWeb3()
        loadBlockchainData()
    }, [])


    function sortArrayDescendingByNumber(array) {
        for (let i = array.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(array[j].number) < parseInt(array[j + 1].number)) {
                    let value = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = value;
                }
            }
        }
        return array
    }
    function sortArrayDescendingByPurity(array) {
        for (let i = array.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (parseInt(array[j].purity) < parseInt(array[j + 1].purity)) {
                    let value = array[j];
                    array[j] = array[j + 1];
                    array[j + 1] = value;
                }
            }
        }
        return array
    }
    const a = async () => {
        let arrayOfIds = [];
        for (let i = parseInt(numberOfNFT) - 1; i >= 0; i--) {
            const tokenId = await NFTcontract2.methods.tokenOfOwnerByIndex(walletAccount, i).call()
            const NFTName = await NFTcontract2.methods.getTokenName(tokenId).call()
            if (NFTName != 'InProcess') {
                const NFTNumber = await NFTcontract2.methods.getTokenNumber(tokenId).call()
                const NFTPurity = await NFTcontract2.methods.getTokenPurity(tokenId).call()
                arrayOfIds.push({ id: i, number: NFTNumber, purity: NFTPurity });
            } else {
                arrayOfIds.push({ id: i, number: 10000000 ** 10, purity: 200 });
            }

        }
        setloanding(true)
        if (sortByNumber) {
            setarrayOfIds2(sortArrayDescendingByNumber(arrayOfIds))
        } else {
            setarrayOfIds2(sortArrayDescendingByPurity(arrayOfIds))
        }
        return arrayOfIds;
    }
    useEffect(() => {
        if (numberOfNFT && NFTcontract2 && walletAccount) {
            a()
        }
    }, [numberOfNFT, NFTcontract2, walletAccount])
    useEffect(() => {
        loadBlockchainData();
    }, [sortByNumber])

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
                closeTimeoutMS={100}
            >
                <div className='flex justify-between sm:justify-center'>
                    <div className='text-zinc-100 cursor-pointer absolute top-5 right-10 spy-5' onClick={closeModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" ame="bi bi-x-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                            <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                        </svg>
                    </div>

                    <div className="card bg-zinc-900 w-80 rounded-xl py-5">
                        <h1 className='text-zinc-100 text-center font-bold text-3xl'>BREEDING</h1>
                    </div>
                </div >
                <div className="flex overflow-auto">
                    {
                        loanding ?
                            arrayOfIds2.map((_, i) => (
                                token2 != _.id ?
                                    <div key={_.id} onClick={() => { setToken1(_.id); closeModal(); }} >
                                        < NFTImage token={_.id} contract={NFTcontract2} account={walletAccount} breed={true}></NFTImage>
                                    </div>
                                    :
                                    <></>
                            ))
                            : <></>
                    }
                </div >
            </Modal>
            <Modal
                isOpen={modalIsOpen2}
                onRequestClose={closeModal2}
                style={customStyles}
                contentLabel="Example Modal"
                closeTimeoutMS={100}
            >
                <div className='flex justify-between sm:justify-center'>
                    <div className='text-zinc-100 cursor-pointer absolute top-5 right-10  py-5' onClick={closeModal2}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" ame="bi bi-x-lg" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z" />
                            <path fillRule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z" />
                        </svg>
                    </div>

                    <div className="card bg-zinc-900 w-80 rounded-xl py-5">
                        <h1 className='text-zinc-100 text-center font-bold text-3xl'>BREEDING</h1>
                    </div>
                </div >
                <div className="flex overflow-auto">
                    {
                        loanding ?
                            arrayOfIds2.map((_, i) => (
                                token1 != _.id ?
                                    <div key={_.id} onClick={() => { setToken2(_.id); closeModal2(); }} >
                                        < NFTImage token={_.id} contract={NFTcontract2} account={walletAccount} breed={true}></NFTImage>
                                    </div>
                                    :
                                    <></>
                            ))
                            : <></>
                    }
                </div >
            </Modal>
            <div className='flex justify-center py-5 pb-0 sm:ml-24'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>BREEDING</h1>
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
            <div className="flex flex-wrap justify-center flex-col lg:flex-row items-center sm:ml-24">

                {
                    token1 != undefined ?
                        <div onClick={() => { openModal() }}>
                            < NFTImage token={token1} contract={NFTcontract2} account={walletAccount} changeBreed={changeBreed}></NFTImage>
                        </div>
                        :
                        <div onClick={() => { openModal() }} className="card bg-zinc-300 border-8 border-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 cursor-pointer">
                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                                <span id="price" className="text-zinc-900 flex justify-between items-center font-bold">
                                    NFT 1
                                </span>
                            </div>
                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                </svg>
                            </div>
                        </div>
                }

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

                {
                    token2 != undefined ?
                        <div onClick={() => { openModal2() }}>
                            < NFTImage token={token2} contract={NFTcontract2} account={walletAccount} changeBreed={changeBreed}></NFTImage>
                        </div>
                        :
                        <div onClick={() => { openModal2() }} className="card bg-zinc-300 border-8 border-zinc-900 w-72 rounded-xl m-4 p-6 space-y-4 cursor-pointer">
                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                                <span id="price" className="text-zinc-900 flex justify-between items-center font-bold">
                                    NFT 2
                                </span>
                            </div>
                            <div className="flex items-center justify-center font-semibold text-2xl border-slate-500 py-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
                                    <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
                                </svg>
                            </div>
                        </div>
                }
            </div>
        </div >
    );
}


