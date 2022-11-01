/**
 * The operations available within the wallet context.
 */
export enum WalletOperation {
    Send = 'send',
    SwapOut = 'swapOut',
}

/**
 * The query parameters available in a send operation.
 */
export enum SendOperationParameter {
    Amount = 'amount',
    Unit = 'unit',
}
