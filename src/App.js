import Routess from './components/Routes/Routes';
import { useEffect } from 'react';
import useData from './components/Hooks/useData';
import { useSelector } from 'react-redux';
import useNFTs from './components/Hooks/useNFTs';
import './App.css'
import LoandingPage from './LoandingPage';

function App() {
  const { loadBlockchainData, loadWeb3, resetData } = useData()
  const { loadNFTData } = useNFTs()
  const userData = useSelector(state => state.data)
  const loanding = useSelector(state => state.loanding)
  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])
  useEffect(() => {
    if (userData.contract && userData.wallet && userData.totalSupply) {
      loadNFTData(userData.contract, userData.wallet, userData.totalSupply)
    }
  }, [userData])
  window.ethereum.on('accountsChanged', () => {
    resetData()
    loadWeb3()
    loadBlockchainData()
  });
  return (
    <>
      {
        loanding &&
        <LoandingPage />
      }

      <Routess />
    </>

  );
}

export default App;


