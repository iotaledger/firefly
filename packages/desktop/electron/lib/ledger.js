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

process.parentPort.on('message', async (message) => {
    switch (message.data.method) {
        case 'generate-evm-address': {
            const data = await getEvmAddress(...message.data.parameters)
            process.parentPort.postMessage({ data })
            break
        }
        default:
            break
    }
})

async function getEvmAddress(coinType, accountIndex, verify) {
    try {
        const transport = await TransportNodeHid.open('')
        listen((log) => {
            process.parentPort.postMessage({ data: log })
        })
        const appEth = new AppEth(transport)
        const address = await appEth.getAddress(buildBip32Path(coinType, accountIndex))
        await transport.close()
        return { evmAddress: address.address, coinType, accountIndex }
    } catch (err) {
        return retryFunction(getEvmAddress, [coinType, accountIndex, verify], 15)
    }
}

function buildBip32Path(coinType, accountIndex) {
    return `44'/${coinType}'/${accountIndex}'/0/0`
}

let retriesCounter = 0

function retryFunction(func, parameters, numberOfRetries) {
    return new Promise((resolve) => setTimeout(resolve, 1000)).then(() => {
        if (retriesCounter === numberOfRetries) {
            retriesCounter = 0
        } else {
            retriesCounter++
            void func(...parameters)
        }
    })
}
