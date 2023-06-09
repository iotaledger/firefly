import { Core } from '@walletconnect/core'
import { Web3Wallet } from '@walletconnect/web3wallet'
import { buildApprovedNamespaces } from '@walletconnect/utils'

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

    web3wallet.on('session_proposal', (sessionProposal) => {
        console.error('Session proposal', sessionProposal)

        const { id, params } = sessionProposal

        const approvedNamespaces = buildApprovedNamespaces({
            proposal: params,
            supportedNamespaces: {
                eip155: {
                    chains: ['eip155:1', 'eip155:137', 'eip155:5'],
                    methods: [
                        'eth_sendTransaction',
                        'eth_signTransaction',
                        'eth_sign',
                        'personal_sign',
                        'eth_signTypedData',
                    ],
                    events: ['accountsChanged', 'chainChanged'],
                    accounts: [
                        'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
                        'eip155:5:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
                        'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
                    ],
                },
            },
        })

        web3wallet.approveSession({
            id,
            namespaces: approvedNamespaces,
        })
    })
    try {
        const topic = uri.split('@')[0]

        await web3wallet.core.pairing.disconnect({ topic: topic.substring(3) })
    } catch (e) {
        console.error(e)
    }
    try {
        await web3wallet.core.pairing.pair({ uri })
    } catch (e) {
        console.error(e)
    }
}
