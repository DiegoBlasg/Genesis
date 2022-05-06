import './App.css';
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import NFT from './abis/NFT.json'
import NFTImage from './NFTImage';

function App() {


  const [walletAccount, setWalletAccount] = useState();
  const [NFTcontract2, setNFTContract2] = useState();
  const [numberOfNFT, setNumberOfNFT] = useState();
  const [loanding, setloanding] = useState(false);

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
    NFTcontract2.methods.safeMint(walletAccount).send({ from: walletAccount, gas: 500000 }, (err, hash) => loadBlockchainData())
    /*NFTcontract2.methods.safeMint(walletAccount).estimateGas({
      from: walletAccount,
      value: window.web3.utils.toWei("10", "ether")
    }, function (error, gasAmount) {
      console.log(gasAmount);
      NFTcontract2.methods.safeMint(walletAccount).send({
        from: walletAccount,
        value: window.web3.utils.toWei("10", "ether"),
        gas: gasAmount,
        gasPrice: 6721975
      }, (err, hash) => loadBlockchainData())
    });*/
  }

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  useEffect(() => {
    if (numberOfNFT && NFTcontract2 && walletAccount) {
      setloanding(true)
    }
  }, [numberOfNFT, NFTcontract2, walletAccount])

  return (
    <div>


      <div className="w-screen h-20 sm:hidden bg-zinc-900">

      </div>
      <div className="h-screen hidden sm:flex fixed ">

        <aside
          className="flex flex-col items-center bg-zinc-900 px-2 text-gray-700 shadow h-full">

          <div className="h-16 flex items-center w-full">
            <a className=" mx-auto w-20" href="/">
              <img className="w-14 mx-auto" src="/logo.png" alt="logo" />
            </a>
          </div>

          <ul>

            <li className=" h-36">
            </li>
            <li className="hover:bg-zinc-800">
              <a href="." className="text-zinc-100 h-16 px-6 flex justify-center items-center w-fullfocus:text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-archive-fill" viewBox="0 0 16 16">
                  <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z" />
                </svg>
              </a>
            </li>
            <li className="hover:bg-zinc-800">
              <a href="." className="text-zinc-100 h-16 px-6 flex justify-center items-center w-fullfocus:text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-heart-half" viewBox="0 0 16 16">
                  <path d="M8 2.748v11.047c3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                </svg>
              </a>
            </li>
            <li className="hover:bg-zinc-800">
              <a href="." className="text-zinc-100 h-16 px-6 flex justify-center items-center w-fullfocus:text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-left-right" viewBox="0 0 16 16">
                  <path d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z" />
                </svg>
              </a>
            </li>
            <li className="hover:bg-zinc-800">
              <a href="." className="text-zinc-100 h-16 px-6 flex justify-center items-center w-fullfocus:text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-cart-x-fill" viewBox="0 0 16 16">
                  <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7.354 5.646 8.5 6.793l1.146-1.147a.5.5 0 0 1 .708.708L9.207 7.5l1.147 1.146a.5.5 0 0 1-.708.708L8.5 8.207 7.354 9.354a.5.5 0 1 1-.708-.708L7.793 7.5 6.646 6.354a.5.5 0 1 1 .708-.708z" />
                </svg>
              </a>
            </li>
          </ul>


          <div className="mt-auto h-16 flex items-center w-full">
            <button
              className="h-16 mx-auto flex justify-center items-center
				w-full focus:text-orange-500 hover:bg-red-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
              </svg>
            </button>
          </div>

        </aside>
      </div>


      <div className='flex justify-center py-5 pb-0 sm:ml-24'>
        <div className="card bg-zinc-900 w-80 rounded-xl m-4 p-6 space-y-4 flex justify-center">
          <h1 className='text-zinc-100 font-bold text-3xl'>INVENTORY</h1>
        </div>
      </div >


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
            Array(parseInt(numberOfNFT)).fill(0).map((_, i) => (
              <div key={i} >
                < NFTImage token={i} contract={NFTcontract2} account={walletAccount} ></NFTImage>
              </div>
            ))
            : <></>
        }

      </div>
    </div >
  );
}

export default App;


