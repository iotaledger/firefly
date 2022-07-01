/**
 * The operations available within the wallet context.
 */
export enum WalletOperation {
    Send = 'send',
}

/**
 * The query parameters available in a send operation.
 */
export enum SendOperationSearchParameter {
    Amount = 'amount',
    Unit = 'unit',
    Metadata = 'metadata',
    Tag = 'tag',
}
