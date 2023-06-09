import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

import { loadAMM, loadAccount, loadBalances, loadProvider, loadNetwork, loadTokens } from '../store/interactions';

function App() {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [contracts, setContracts] = useState([])

  const dispatch = useDispatch()
  const account = useSelector(state => state.provider.account)

  const loadBlockchainData = async () => {

    const provider = await loadProvider(dispatch)

    const chainId = await loadNetwork(provider, dispatch)

    const contracts = await loadTokens(provider, chainId, dispatch)  //6/9/23 2:11am changed from setContracts to loadTokens 

    // Fetch accounts from meta mask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
      await loadBalances(provider, contracts, dispatch); // Dispatch loadBalances here      
    })
    
    //Initiate contracts
    await loadTokens(provider, chainId, dispatch)
    await loadAMM(provider, chainId, dispatch)

    // Fetch account balance
    const balance = await provider.getBalance(account)
    const formattedBalance = ethers.utils.formatUnits(balance, 18)
    setBalance(formattedBalance)

    setIsLoading(false)
  }

  useEffect(() => {
      loadBlockchainData()
  }, []);

  return (
    <Container>
      <Navigation/>

      <h1 className='my-4 text-center'>React Hardhat Template</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className='text-center'><strong>Your ETH Balance:</strong> {balance} ETH</p>
          <p className='text-center'>Edit App.js to add your code here.</p>
        </>
      )}
    </Container>
  )
}

export default App;