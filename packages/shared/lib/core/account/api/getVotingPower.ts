import { getAccount } from '@core/profile-manager'

export async function getVotingPower(index?: number): Promise<string> {
    return (await getAccount(index))?.getVotingPower()
}
