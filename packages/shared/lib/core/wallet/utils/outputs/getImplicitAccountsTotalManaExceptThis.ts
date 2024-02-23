import { OutputData } from '@iota/sdk/out/types'
import { getManaDetailsForOutput } from '@core/network'

export async function getImplicitAccountsTotalManaExceptThis(
    outputs: OutputData[],
    currentOutputId: string
): Promise<number> {
    let totalMana: number = 0
    await Promise.all(
        outputs.map(async (outputData: OutputData) => {
            if (outputData.outputId.toString() !== currentOutputId) {
                const manaDetails = await getManaDetailsForOutput(outputData)
                totalMana += manaDetails ?? 0
            }
        })
    )
    return totalMana
}
