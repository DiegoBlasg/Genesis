import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import NFT from '../../abis/NFT.json'
import NFTImage from '../NFTImage';

export default function Inventory() {

    const [walletAccount, setWalletAccount] = useState();
    const [NFTcontract2, setNFTContract2] = useState();
    const [numberOfNFT, setNumberOfNFT] = useState();
    const [loanding, setloanding] = useState(false);
    const [arrayOfIds2, setarrayOfIds2] = useState([]);
    const [sortByNumber, setsortByNumber] = useState(true);

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

    const mint = async () => {
        console.log('¡Nuevo NFT en procedimiento!')
        //NFTcontract2.methods.safeMint(walletAccount).send({ from: walletAccount, gas: 400000 }, (err, hash) => loadBlockchainData())
        NFTcontract2.methods.safeMint(walletAccount).estimateGas({
            from: walletAccount,
            //value: window.web3.utils.toWei("10", "ether")
        }, function (error, gasAmount) {
            console.log(gasAmount);
            NFTcontract2.methods.safeMint(walletAccount).send({
                from: walletAccount,
                //value: window.web3.utils.toWei("10", "ether"),
                gas: parseInt(gasAmount + gasAmount * 0.3),
            }, (err, hash) => loadBlockchainData())
        });
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
            const NFTTimeToClaim = await NFTcontract2.methods.getTokenTimeToClaim(tokenId).call()
            const date = new Date(NFTTimeToClaim * 1000);
            const now = new Date()

            if (date < now) {
                const NFTNumber = await NFTcontract2.methods.getTokenNumber(tokenId).call()
                const NFTPurity = await NFTcontract2.methods.getTokenPurity(tokenId).call()
                arrayOfIds.push({ id: i, number: NFTNumber, purity: NFTPurity });
            } else {
                arrayOfIds.push({ id: i, number: 1000000000000000, purity: 200 });
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
                    loanding ?
                        arrayOfIds2.map((_, i) => (
                            <div key={_.id}>
                                < NFTImage token={_.id} contract={NFTcontract2} account={walletAccount}></NFTImage>
                            </div>
                        ))
                        : <></>
                }


            </div>
        </div >
    );
}


