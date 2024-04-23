import { OutputData } from '@iota/sdk/out/types'
import { getPassiveManaForOutput } from './getPassiveManaForOutput'

export function getAccountOutputsMana(accountOutputs: OutputData[]): number {
    return accountOutputs?.reduce((acc: number, outputData: OutputData) => {
        const totalMana = getPassiveManaForOutput(outputData)
        return totalMana ? acc + totalMana : acc
    }, 0)
}
