/**
 * NOTE: The enum variant values MUST be in PascalCase,
 * so that it matches the wallet-rs naming exactly.
 */
export enum WalletApiEvent {
    ConsolidationRequired = 'ConsolidationRequired',
    LedgerAddressGeneration = 'LedgerAddressGeneration',
    NewOutput = 'NewOutput',
    SpentOutput = 'SpentOutput',
    TransactionInclusion = 'TransactionInclusion',
    TransactionProgress = 'TransactionProgress',
}
