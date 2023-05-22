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

const { Chain, Common } = require('@ethereumjs/common')
const { Transaction, TxData } = require('@ethereumjs/tx')
const { RLP } = require('@ethereumjs/rlp')
const { bufArrToArr } = require('@ethereumjs/util')

process.parentPort.on('message', async (message) => {
    try {
        let data
        switch (message.data.method) {
            case 'generate-evm-address': {
                data = await getEvmAddress(...message.data.parameters)
                break
            }
            case 'sign-evm-transaction': {
                data = await signTransactionData(...message.data.parameters)
                break
            }
            default:
                break
        }
        process.parentPort.postMessage({ data })
    } catch (error) {
        process.parentPort.postMessage({ error })
    }
})

async function getEvmAddress(coinType, accountIndex, verify) {
    const transport = await TransportNodeHid.open('')
    listen((log) => {
        process.parentPort.postMessage({ data: log })
    })
    const appEth = new AppEth(transport)
    const data = await appEth.getAddress(buildBip32Path(coinType, accountIndex))

    await transport.close()

    return { evmAddress: data.address, coinType, accountIndex }
}

function buildBip32Path(coinType, accountIndex) {
    return `44'/${coinType}'/${accountIndex}'/0/0`
}

async function signTransactionData(data, coinType, accountIndex) {
    const transport = await TransportNodeHid.open('')
    listen((log) => {
        process.parentPort.postMessage({ data: log })
    })
    const appEth = new AppEth(transport)

    const common = new Common({ chain: 11155111 })
    const unsignedTransactionObject = Transaction.fromTxData(data, { common })
    const unsignedTransaction = unsignedTransactionObject.getMessageToSign(false)
    const serializedUnsignedTransaction = Buffer.from(RLP.encode(bufArrToArr(unsignedTransaction)))
    const signature = await appEth.signTransaction(
        buildBip32Path(coinType, accountIndex),
        serializedUnsignedTransaction
    )

    const signedTransactionObject = Transaction.fromTxData(
        {
            ...data,
            v: '0x' + signature.v,
            r: '0x' + signature.r,
            s: '0x' + signature.s,
        },
        { common }
    )
    const serializedSignedTransaction = Buffer.from(RLP.encode(bufArrToArr(signedTransactionObject.raw())))
    const serializedSignedTransactionString = '0x' + serializedSignedTransaction.toString('hex')

    // await transport.close()

    return { signedTransaction: serializedSignedTransactionString }
}
