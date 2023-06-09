import { WALLET_METADATA, core } from '../constants'
import { onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores'
import { Web3Wallet } from '@walletconnect/web3wallet'

export async function initializeWalletConnect(): Promise<void> {
    const client = await Web3Wallet.init({
        core,
        metadata: WALLET_METADATA,
    })
    walletClient.set(client)

    client.on('session_proposal', (sessionProposal) => onSessionProposal(sessionProposal))
    client.on('session_request', (event) => onSessionRequest(event))
}
