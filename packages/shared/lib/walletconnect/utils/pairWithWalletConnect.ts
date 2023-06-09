import { Web3Wallet } from '@walletconnect/web3wallet/dist/types/client'

export async function pairWithWalletConnect(web3wallet: Web3Wallet, uri: string): Promise<void> {
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
