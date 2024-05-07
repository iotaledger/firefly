import { TransactionOptions } from '@iota/sdk/out/types'

export function getDefaultTransactionOptions(): TransactionOptions {
    return {
        remainderValueStrategy: {
            /** The name of the strategy. */
            strategy: 'ReuseAddress',
            /** Only required for `CustomAddress`. */
            value: null,
        },
        allowMicroAmount: true,
    }
}
