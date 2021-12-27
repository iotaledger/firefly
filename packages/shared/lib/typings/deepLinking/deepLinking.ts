import type { NotificationData } from '../notification'
import type { SendOperationParameters } from './walletContext'

export enum DeepLinkingContexts {
    Wallet = 'wallet',
}

export interface DeepLinkParameters {
    context: string
    operation: string
    params: void | SendOperationParameters
    notification: NotificationData
}
