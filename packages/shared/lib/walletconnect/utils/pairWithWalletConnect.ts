export async function pairWithWalletConnect(web3wallet: any, uri: string): Promise<void> {
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
