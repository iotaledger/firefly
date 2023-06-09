import { WALLET_METADATA, core } from '../constants'
import { onSessionProposal, onSessionRequest } from '../handlers'
import { pairWithWalletConnect } from './pairWithWalletConnect'
import { Web3Wallet } from '@walletconnect/web3wallet'

export async function initializeWalletConnect(uri: string): Promise<void> {
    const web3wallet = await Web3Wallet.init({
        core,
        metadata: WALLET_METADATA,
    })

    web3wallet.on('session_proposal', (sessionProposal) => onSessionProposal(web3wallet, sessionProposal))

    web3wallet.on('session_request', (event) => onSessionRequest(web3wallet, event))

    await pairWithWalletConnect(web3wallet, uri)
}
