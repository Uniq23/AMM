import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';

import { loadAccount, loadProvider, loadNetwork } from '../store/interactions';

function App() {
  const [balance, setBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const account = useSelector(state => state.provider.account)

  const loadBlockchainData = async () => {

    const provider = await loadProvider(dispatch)

    const chainId = await loadNetwork(dispatch)

    // Fetch accounts
    await loadAccount(dispatch)

    // Fetch account balance
    const balance = await provider.getBalance(account)
    const formattedBalance = ethers.utils.formatUnits(balance, 18)
    setBalance(formattedBalance)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading])

  return (
    <Container>
      <Navigation account={account} />

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
