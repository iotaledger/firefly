import type { OutputTypes } from '@iota/types'
import { InclusionState } from '@iota/wallet'
import { IOutputResponse, IUTXOInput } from '@iota/types'

export interface IProcessedOutput {
    type: string
    output: OutputTypes
    outputId: string
    transactionId: string
    time: Date
    claimingOutput: OutputTypes
    inclusionState: InclusionState
    transactionInputs: IOutputResponse[]
    transactionInputs2: IUTXOInput[]
}
