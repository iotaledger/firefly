import { OutputData } from '@iota/sdk/out/types'
import { getTotalManaForOutput } from '@core/network'

export function getImplicitAccountsTotalManaExceptThis(outputs: OutputData[], currentOutputId: string): number {
    return outputs.reduce((acc: number, outputData: OutputData) => {
        if (outputData.outputId.toString() !== currentOutputId) {
            const totalMana = getTotalManaForOutput(outputData)
            return totalMana ? acc + totalMana : acc
        } else {
            return acc
        }
    }, 0)
}
