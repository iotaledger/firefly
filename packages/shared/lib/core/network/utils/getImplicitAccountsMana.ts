import { OutputData } from '@iota/sdk/out/types'
import { getPassiveManaForOutput } from './getPassiveManaForOutput'

export function getImplicitAccountsMana(implicitAccountOutputs: OutputData[], excludeIds: string[]): number {
    return implicitAccountOutputs?.reduce((acc: number, outputData: OutputData) => {
        if (excludeIds.length >= 1 && !excludeIds.includes(outputData.outputId)) {
            const totalMana = getPassiveManaForOutput(outputData)
            return totalMana ? acc + totalMana : acc
        } else {
            return acc
        }
    }, 0)
}
