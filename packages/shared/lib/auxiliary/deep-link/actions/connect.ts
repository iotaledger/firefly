import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'

export async function initializeWalletConnect(uri: string): Promise<void> {
    const core = new Core({
        projectId: '41511f9b50c46a80cdf8bd1a3532f2f9',
    })

    const web3wallet = await Web3Wallet.init({
        core, // <- pass the shared `core` instance
        metadata: {
            name: 'Demo app',
            description: 'Demo Client as Wallet/Peer',
            url: 'www.walletconnect.com',
            icons: [],
        },
    })

    web3wallet.on('session_proposal', (proposal) => {
        console.error('Session proposal', proposal)

        web3wallet.approveSession({
            id: proposal.id,
            namespaces: {
                default: { accounts: [], methods: ['eth_sendTransaction'], events: [] },
            },
        })
    })

    await web3wallet.core.pairing.pair({ uri })
}
