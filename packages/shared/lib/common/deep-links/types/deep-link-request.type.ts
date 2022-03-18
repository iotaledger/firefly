import type { NotificationData } from '@core/notifications'

import { DeepLinkContext, WalletOperation } from '../enums'
import { SendOperationParameters } from './wallet-context.type'

export type DeepLinkOperation = WalletOperation

export type DeepLinkParameters = void | SendOperationParameters

export type DeepLinkRequest = {
    context: DeepLinkContext
    operation: DeepLinkOperation
    parameters: DeepLinkParameters
    notification: NotificationData
}
