import { IAsset, Subject } from '@core/wallet'

export interface ILedgerSendConfirmationProps {
    asset: IAsset
    amount: string
    unit: string
    recipient: Subject
    internal: boolean
    metadata: string
    tag: string
}
