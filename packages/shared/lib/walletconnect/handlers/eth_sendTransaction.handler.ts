import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'

export function handleEthSendTransaction(
    id: number,
    params: unknown,
    responseCallback: (response: JsonRpcResponse) => void
): void {
    if (!params || !Array.isArray(params)) {
        responseCallback({ id, error: { code: 5000, message: 'Error' }, jsonrpc: '2.0' })
        return
    }

    const transactionObject = params[0]
    if (!transactionObject || typeof transactionObject !== 'object') {
        responseCallback({ id, error: { code: 5000, message: 'Error' }, jsonrpc: '2.0' })
        return
    }

    // transactionObject = {
    //     "from": "0x0695883f9a3D651f2bfe115849e936f7808E4DEe",
    //     "to": "0x0695883f9a3D651f2bfe115849e936f7808E4DEe",
    //     "data": "0x",
    //     "nonce": "0x00",
    //     "gasPrice": "0x04d3a549a8",
    //     "gasLimit": "0x5208",
    //     "value": "0x00"
    // }
}
