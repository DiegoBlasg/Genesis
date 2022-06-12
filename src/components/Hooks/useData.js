import { useDispatch } from "react-redux";
import Web3 from 'web3'
import NFT from '../../abis/NFT.json'

const useData = () => {
    const dispatch = useDispatch()

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
        dispatch({
            type: '@loanding/change',
            payload: true
        })
        const web3 = window.web3
        // Cargar una cuenta
        const accounts = await web3.eth.getAccounts()
        const networkId = await web3.eth.net.getId()
        const networkData = NFT.networks[networkId]
        if (networkData) {
            const abi = NFT.abi
            const address = networkData.address
            const contract = new web3.eth.Contract(abi, address)
            // Función 'totalSupply' del Smart Contract
            const totalSupply = await contract.methods.balanceOf(accounts[0]).call()

            dispatch({
                type: '@data/init',
                payload: {
                    wallet: accounts[0],
                    contract,
                    totalSupply
                }
            })

        } else {
            window.alert('¡Smart Contract no desplegado en la red!')
        }
    }
    return {
        loadWeb3, loadBlockchainData
    }
}
export default useData