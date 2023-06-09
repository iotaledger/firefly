import { Converter } from '@iota/util.js'
import { openPopup, PopupId } from '../../../../desktop/lib/auxiliary/popup'

export function handlePersonalSign(id: number, params: any, responseCallback: (response: any) => void): void {
    const message = Converter.hexToUtf8(params)

    // sign the message
    // const signedMessage = await wallet.signMessage(message)

    const signedMessage = 'hello this is signed'
    const response = { id, result: signedMessage, jsonrpc: '2.0' }

    openPopup({
        id: PopupId.Confirmation,
        props: {
            title: 'Personal Sign',
            description: 'Do you wanna sign the following message: ' + message,
            onConfirm: () => responseCallback(response),
            onCancel: () => responseCallback({ id, error: { code: 5000, message: 'User rejected' }, jsonrpc: '2.0' }),
        }
    })
}
