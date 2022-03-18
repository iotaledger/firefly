/**
 * The operations available within the wallet context.
 */
export enum WalletOperation {
    Send = 'send',
}

/**
 * The query parameters available in a send operation.
 */
export enum SendOperationParameter {
    Amount = 'amount',
    Unit = 'unit',
}
