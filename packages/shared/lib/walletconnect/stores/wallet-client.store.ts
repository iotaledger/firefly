import { Web3Wallet } from '@walletconnect/web3wallet/dist/types/client'
import { Writable, writable } from 'svelte/store'

export const walletClient: Writable<Web3Wallet | undefined> = writable(undefined)
