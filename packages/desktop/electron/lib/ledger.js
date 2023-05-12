/**
 * The utility process for ledger runs in a Node.js environment,
 * meaning it has the ability to require modules and use all of Node.js APIs.
 * This approach doesn't block the main process when interacting with the ledger device.
 *
 * https://www.electronjs.org/docs/latest/tutorial/process-model#the-utility-process
 */

const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default
const AppEth = require('@ledgerhq/hw-app-eth').default
const { listen } = require('@ledgerhq/logs')

const ETH_BIP32_PATH = '44\'/60\'/0\'/0/0'

process.parentPort.on('message', async (message) => {
    process.parentPort.postMessage({ message })

    switch (message.data) {
        case 'request-evm-address': {
            const data = await getEthereumAddress(message)
            process.parentPort.postMessage({ data })
            break
        }
        default:
            break
    }
})

async function getEthereumAddress(verify) {
    try {
        const transport = await TransportNodeHid.open('')
        listen((log) => process.parentPort.postMessage({ data: log }))
        const appEth = new AppEth(transport)
        const address = await appEth.getAddress(ETH_BIP32_PATH)
        await transport.close()
        return address
    } catch (err) {
        // try again until success!
        return new Promise((s) => setTimeout(s, 1000)).then(() => getEthereumAddress(verify))
    }
}
