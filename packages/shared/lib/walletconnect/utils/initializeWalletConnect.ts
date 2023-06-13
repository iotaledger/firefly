import features from '@features/features'
import { WALLET_METADATA } from '../constants'
import { onSessionProposal, onSessionRequest } from '../handlers'
import { walletClient } from '../stores'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { Core } from '@walletconnect/core'

const core = new Core({
    projectId: process.env.WALLETCONNECT_PROJECT_ID ?? '41511f9b50c46a80cdf8bd1a3532f2f9',
})

export async function initializeWalletConnect(): Promise<void> {
    if (!features?.wallet?.walletConnect?.enabled) {
        return
    }

    const client = await Web3Wallet.init({
        core,
        metadata: WALLET_METADATA,
    })
    walletClient.set(client)

    client.on('session_proposal', (sessionProposal) => onSessionProposal(sessionProposal))
    client.on('session_request', (event) => onSessionRequest(event))
}
