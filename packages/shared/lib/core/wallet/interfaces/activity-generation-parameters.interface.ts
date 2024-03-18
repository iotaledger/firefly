import { ActivityAction } from '../enums'
import { IProcessedTransaction, ProcessedTransaction } from './processed-transaction.interface'
import { IWrappedOutput } from './wrapped-output.interface'

export interface ActivityGenerationParameters {
    action: ActivityAction
    processedTransaction: ProcessedTransaction
    wrappedOutput: IWrappedOutput
}
