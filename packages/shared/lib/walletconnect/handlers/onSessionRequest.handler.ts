import { handleEthSendTransaction } from './eth_sendTransaction.handler'
import { handleEthSign } from './eth_sign.handler'
import { handleEthSignTransaction } from './eth_signTransaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handlePersonalSign } from './personal_sign.handler'
import { JsonRpcResponse } from '@walletconnect/jsonrpc-types'
import { Web3WalletTypes } from '@walletconnect/web3wallet'
import { get } from 'svelte/store'
import { walletClient } from '../stores'

export function onSessionRequest(event: Web3WalletTypes.SessionRequest): void {
    const { topic, params, id } = event
    const { request } = params
    // const chainId = params.chainId
    const method = request.method

    function returnResponse(response: JsonRpcResponse): void {
        void get(walletClient)?.respondSessionRequest({ topic, response })
    }

    switch (method) {
        case 'eth_sendTransaction':
            handleEthSendTransaction(id, request.params, returnResponse)
            break
        case 'eth_signTransaction':
            handleEthSignTransaction()
            break
        case 'eth_sign':
            handleEthSign()
            break
        case 'personal_sign':
            handlePersonalSign(id, request.params, returnResponse)
            break
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break
        default:
            break
    }
}
