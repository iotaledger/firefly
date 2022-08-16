import type { OutputTypes } from '@iota/types'
import { InclusionState } from '@core/wallet/enums'
import { IOutputResponse, IUTXOInput } from '@iota/types'

export interface IProcessedOutput {
    type: string
    output: OutputTypes
    outputId: string
    transactionId: string
    time: Date
    isSelfTransaction: boolean
    claimingOutput: OutputTypes
    inclusionState: InclusionState
    transactionInputs: IOutputResponse[]
    transactionInputs2: IUTXOInput[]
}
