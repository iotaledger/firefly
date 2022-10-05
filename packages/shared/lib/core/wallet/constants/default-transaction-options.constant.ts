import { TransactionOptions } from '@iota/wallet'

export const DEFAULT_TRANSACTION_OPTIONS: TransactionOptions = {
    remainderValueStrategy: { strategy: 'ReuseAddress', value: null },
}
