import { TransactionOptions } from '@iota/sdk/out/types'

export const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
    remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
    allowMicroAmount: true,
}
