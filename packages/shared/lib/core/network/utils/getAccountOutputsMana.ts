import { OutputData } from '@iota/sdk/out/types'
import { getPassiveManaForOutput } from './getPassiveManaForOutput'

export function getAccountOutputsMana(accountOutputs: OutputData[], excludeIds: string[]): number {
    return accountOutputs?.reduce((acc: number, outputData: OutputData) => {
        if (!excludeIds.includes(outputData.outputId)) {
            const totalMana = getPassiveManaForOutput(outputData)
            return totalMana ? acc + totalMana : acc
        } else {
            return acc
        }
    }, 0)
}
