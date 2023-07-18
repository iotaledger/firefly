/**
 * NOTE: The enum variant values MUST be in PascalCase,
 * so that it matches the wallet-rs naming exactly.
 */
export enum WalletApiEvent {
    ConsolidationRequired = 0,
    LedgerAddressGeneration = 1,
    NewOutput = 2,
    SpentOutput = 3,
    TransactionInclusion = 4,
    TransactionProgress = 5,
}
