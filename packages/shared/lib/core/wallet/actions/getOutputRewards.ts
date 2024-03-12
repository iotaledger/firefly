import { getClient } from './getClient'

export async function getOutputRewards(outputId: string): Promise<number> {
    const client = await getClient()
    const rewardsResponse = await client.getOutputManaRewards(outputId)
    return rewardsResponse ? Number(rewardsResponse.rewards) : 0
}
