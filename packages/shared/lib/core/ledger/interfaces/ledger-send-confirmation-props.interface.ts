import { IAsset, Subject } from '@core/wallet'

export interface LedgerSendConfirmationProps {
    asset: IAsset
    amount: string
    unit: string
    recipient: Subject
    internal: boolean
    metadata: string
    tag: string
}
