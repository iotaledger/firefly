import { ActivityAction } from '../enums'
import { IProcessedTransaction } from './processed-transaction.interface'
import { IWrappedOutput } from './wrapped-output.interface'

export interface IActivityGenerationParameters {
    action: ActivityAction
    processedTransaction: IProcessedTransaction
    wrappedOutput: IWrappedOutput
}
