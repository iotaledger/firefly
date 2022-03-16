import type { NotificationData } from '@core/notifications'

import type { DeepLinkContext, SendOperationParameters, WalletOperation } from '@common/deep-links'

export type DeepLinkOperation = WalletOperation

export type DeepLinkParameters = void | SendOperationParameters

export type DeepLinkRequest = {
    context: DeepLinkContext
    operation: DeepLinkOperation
    parameters: DeepLinkParameters
    notification: NotificationData
}
