import { ethers } from 'ethers'

import {
  setProvider,
  setNetwork,
  setAccount
} from '../store/reducers/provider';

import {
  setContracts,
  setSymbols,
  balancesLoaded,
  sharesLoaded
} from '../store/reducers/tokens';

import {
  setContract,
} from '../store/reducers/amm';

import TOKEN_ABI from '../abis/Token.json';
import AMM_ABI from '../abis/AMM.json';
import config from '../config.json';

export const loadProvider = (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  dispatch(setProvider(provider))

  return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId))

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  console.log(accounts)
  const account = ethers.utils.getAddress(accounts[0])
  dispatch(setAccount(account))

  return account
}

// LOAD CONTRACTS
export const loadTokens = async (provider, chainId, dispatch) => {
  console.log(config[chainId].dapp.address)
  const dapp = new ethers.Contract(config[chainId].dapp.address, TOKEN_ABI, provider)
  const usd = new ethers.Contract(config[chainId].usd.address, TOKEN_ABI, provider)


  dispatch(setContracts([dapp, usd]))
  dispatch(setSymbols([await dapp.symbol(), await usd.symbol()]))
}

export const loadAMM = async (provider, chainId, dispatch) => {
  console.log(config[chainId].amm.address)
  const amm = new ethers.Contract(config[chainId].amm.address, AMM_ABI, provider)
  dispatch(setContract(amm))

  return amm
}

// LOAD BALANCES & SHARES
export const loadBalances = async (amm, tokens, account, dispatch) => {
  const balance1 = await tokens[0].balanceOf(account)
  const balance2 = await tokens[1].balanceOf(account)

  dispatch(balancesLoaded([
    ethers.utils.formatUnits(balance1.toString(), 'ether'),
    ethers.utils.formatUnits(balance2.toString(), 'ether')
  ]))

  const shares = await amm.shares(account)
  //dispatch(sharesLoaded(ethers.utils.formatUnits(shares.toString(), 'ether')))   //Todo not sure about this code 6/8/23
}
