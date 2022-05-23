import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import NFT from '../../abis/NFT.json'
import NFTImage from '../NFTImage';

export default function NFTtrash() {

    const [arrayOfIds2, setarrayOfIds2] = useState([]);
    const [walletAccount, setWalletAccount] = useState();
    const [NFTcontract2, setNFTContract2] = useState();
    const [numberOfNFT, setNumberOfNFT] = useState();
    const [loanding, setloanding] = useState(false);

    const [NFTselect, setNFTselect] = useState();
    const [NFTselectArray, setNFTselectArray] = useState([]);
    const [NFTselectArrayForBurn, setNFTselectArrayForBurn] = useState([]);
    const [sortByNumber, setsortByNumber] = useState(true);
    const [loandingTrash, setloandingTrash] = useState(false);

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

    const reset = async () => {
        setloanding(false)
        setNFTselectArrayForBurn([])
        setNFTselectArray([])
        const totalSupply = await NFTcontract2.methods.balanceOf(walletAccount).call()
        setNumberOfNFT(totalSupply);
        setloandingTrash(false)
    }

    const burn = () => {
        setloandingTrash(true)
        if (NFTselectArrayForBurn.length > 0) {
            if (NFTselectArrayForBurn.length == 1) {
                NFTcontract2.methods.simpleburn(NFTselectArrayForBurn[0]).estimateGas({
                    from: walletAccount,
                    //value: window.web3.utils.toWei("10", "ether")
                }, function (error, gasAmount) {
                    console.log(gasAmount);
                    NFTcontract2.methods.simpleburn(NFTselectArrayForBurn[0]).send({
                        from: walletAccount,
                        //value: window.web3.utils.toWei("10", "ether"),
                        gas: gasAmount,
                    }, (err, hash) => {
                        reset();
                    })
                });
                return;
            }
            NFTcontract2.methods.multipleburn(NFTselectArrayForBurn).estimateGas({
                from: walletAccount,
                //value: window.web3.utils.toWei("10", "ether")
            }, function (error, gasAmount) {
                console.log(gasAmount);
                NFTcontract2.methods.multipleburn(NFTselectArrayForBurn).send({
                    from: walletAccount,
                    //value: window.web3.utils.toWei("10", "ether"),
                    gas: gasAmount,
                }, (err, hash) => {
                    reset();
                })
            });
        }
    }
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
    const al = async () => {
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
            al()
        }
    }, [numberOfNFT, NFTcontract2, walletAccount])
    useEffect(() => {
        loadWeb3()
        loadBlockchainData();
    }, [sortByNumber])

    useEffect(() => {
        loadWeb3()
        loadBlockchainData()
    }, [])
    const a = async () => {
        if (NFTselect) {
            let a = NFTselectArray;
            if (!a.includes(NFTselect)) {
                a.push(NFTselect)
                setNFTselectArray(a)
            } else {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === NFTselect) {
                        a.splice(i, 1);
                    }
                }
            }
            setNFTselect(undefined)
        }
    }
    const o = async () => {
        if (NFTselect) {
            const tokenId1 = await NFTcontract2.methods.tokenOfOwnerByIndex(walletAccount, NFTselect - 1).call()
            let a = NFTselectArrayForBurn;
            if (!a.includes(parseInt(tokenId1) + 1)) {
                a.push(parseInt(tokenId1) + 1)
                setNFTselectArrayForBurn(a)
                console.log(NFTselectArrayForBurn);
            } else {
                for (var i = 0; i < a.length; i++) {
                    if (a[i] === parseInt(tokenId1) + 1) {
                        a.splice(i, 1);
                    }
                }
            }
            setNFTselect(undefined)
        }
    }
    useEffect(() => {
        a()
        o()
    }, [NFTselect])

    return (
        <div>
            <div className='flex justify-center py-5 pb-0 sm:ml-24'>
                <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
                    <h1 className='text-zinc-100 font-bold text-3xl'>TRASH</h1>
                </div>
            </div >
            <div className="flex flex-wrap sm:ml-24 justify-center">
                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => setsortByNumber(true)}>
                    <div className={`card ${sortByNumber ? "bg-teal-600" : "bg-zinc-900"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>NUMBER</h1>
                    </div>
                </div >

                <div className='flex justify-center pb-0' onClick={burn}>
                    {
                        loandingTrash ?
                            <div className="card bg-zinc-900 w-40 rounded-xl m-4 space-y-4 flex justify-center text-white cursor-pointer">
                                <div className='flex justify-center w-11 items-center text-cyan-300'>
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
                            </div>
                            :
                            <div className="card bg-zinc-900 w-40 rounded-xl m-4 p-6 space-y-4 flex justify-center text-white cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                </svg>
                            </div>
                    }


                </div >
                <div className='flex justify-center pb-0 cursor-pointer' onClick={() => setsortByNumber(false)}>
                    <div className={`card ${sortByNumber ? "bg-zinc-900" : "bg-teal-600"} rounded-xl m-4 p-6 px-12 space-y-4 flex justify-center`}>
                        <h1 className='text-zinc-100 font-bold text-xl'>PURITY</h1>
                    </div>
                </div >
            </div>

            <div className="flex flex-wrap justify-center sm:ml-24">

                {
                    loanding ?
                        arrayOfIds2.map((_, i) => (
                            <div key={_.id} className="cursor-pointer" onClick={() => setNFTselect(_.id + 1)}>
                                < NFTImage token={_.id} contract={NFTcontract2} account={walletAccount} breed={true} selercted={NFTselectArray}></NFTImage>
                            </div>
                        ))
                        : <></>
                }
            </div >
        </div >
    )
}