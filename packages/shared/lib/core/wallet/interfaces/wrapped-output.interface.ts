import { Output, OutputData } from '@iota/wallet/out/types'

export interface IWrappedOutput extends Omit<Partial<OutputData>, 'output'> {
    outputId: string
    output: Output
}
