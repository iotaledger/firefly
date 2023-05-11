import { ISC_SANDBOX_ABI } from '../abis/'
import Web3 from 'web3'
import { network } from '../stores'
import { get } from 'svelte/store'

const ISC_CONTRACT_ADDRESS = '0x1074000000000000000000000000000000000000';
const HARDCODED_EVM_ADDRESS = 'PUT_YOUR_EVM_ADDRESS_HERE';

export async function getAssetsOfChain(): Promise<void> {
    console.log('ISC ABI: ', ISC_SANDBOX_ABI)
}
