import Routess from './components/Routes/Routes';
import { useEffect } from 'react';
import useData from './components/Hooks/useData';

function App() {
  const { loadBlockchainData, loadWeb3 } = useData()

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])
  return (
    <Routess />
  );
}

export default App;


