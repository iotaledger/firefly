import { TransactionOptions } from '@iota/wallet/out/types'

export const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
    remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
    allowMicroAmount: true,
}
