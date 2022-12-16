import { ActivityAction, ActivityType } from '../enums'
import { IProcessedTransaction } from './processed-transaction.interface'
import { IWrappedOutput } from './wrapped-output.interface'

export interface IActivityGenerationParameters {
    type: ActivityType
    action: ActivityAction
    processedTransaction: IProcessedTransaction
    wrappedOutput: IWrappedOutput
}
