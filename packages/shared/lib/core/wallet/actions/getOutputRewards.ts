import { getClient } from './getClient'

export async function getOutputRewards(outputId: string): Promise<number> {
    const client = await getClient()
    const rewards = await client.getOutputManaRewards(outputId)
    return Number(rewards)
}
