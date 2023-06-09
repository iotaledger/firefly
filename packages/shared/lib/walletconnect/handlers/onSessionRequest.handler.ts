import { handleEthSendTransaction } from './eth_sendTransaction.handler'
import { handleEthSign } from './eth_sign.handler'
import { handleEthSignTransaction } from './eth_signTransaction.handler'
import { handleEthSignTypedData } from './eth_signTypedData.handler'
import { handlePersonalSign } from './personal_sign.handler'

export function onSessionRequest(web3wallet: any, event: any): void {
    const { topic, params, id } = event
    const { request, chainId } = params
    const method = request.method
    const requestParams = request.params[0]
    const address = request.params[1]

    function returnResponse(response: any): void {
        web3wallet.respondSessionRequest({ topic, response })
    }

    switch (method) {
        case 'eth_sendTransaction':
            handleEthSendTransaction()
            break;
        case 'eth_signTransaction':
            handleEthSignTransaction()
            break;
        case 'eth_sign':
            handleEthSign()
            break;
        case 'personal_sign':
            handlePersonalSign(id, requestParams, returnResponse)
            break;
        case 'eth_signTypedData':
            handleEthSignTypedData()
            break;
        default:
            break;
    }
}
