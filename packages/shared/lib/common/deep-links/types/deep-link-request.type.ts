import type { NotificationData } from '../../../typings/notification'

import type { DeepLinkContext, SendOperationParameters, WalletOperation } from '@common/deep-links'

/**
 * A union type of all deep link contexts' operations.
 */
export type DeepLinkOperation = WalletOperation

/**
 * A union type of all deep link operations' parameters.
 */
export type DeepLinkParameters = void | SendOperationParameters

/**
 * The content of a deep link request.
 */
export type DeepLinkRequest = {
    context: DeepLinkContext
    operation: DeepLinkOperation
    parameters: DeepLinkParameters
    notification: NotificationData
}