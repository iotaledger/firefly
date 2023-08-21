import {
    ConsolidationRequiredWalletEvent,
    LedgerAddressGenerationWalletEvent,
    NewOutputWalletEvent,
    SpentOutputWalletEvent,
    TransactionInclusionWalletEvent,
    TransactionProgressWalletEvent,
} from '@iota/wallet'

export interface IWalletApiEventPayloadWrapper {
    accountIndex: number
    payload: IWalletApiEventPayload
}

export type IWalletApiEventPayload =
    | ConsolidationRequiredWalletEvent
    | LedgerAddressGenerationWalletEvent
    | NewOutputWalletEvent
    | SpentOutputWalletEvent
    | TransactionInclusionWalletEvent
    | TransactionProgressWalletEvent
