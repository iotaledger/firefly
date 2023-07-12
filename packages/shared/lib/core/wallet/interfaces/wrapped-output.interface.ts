import { Output, OutputData } from '@iota/wallet'

export interface IWrappedOutput extends Omit<Partial<OutputData>, 'output'> {
    outputId: string
    output: Output
}
