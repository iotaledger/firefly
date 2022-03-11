import { NotificationData } from '../notification'
import { SendOperationParameters } from './walletContext'

export enum DeepLinkingContexts {
    Wallet = 'wallet',
}

export interface DeepLinkParameters {
    context: string
    operation: string
    params: void | SendOperationParameters
    notification: NotificationData
}
