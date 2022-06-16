import { getAccount } from '@core/profile-manager'
import { IBasicOutput } from '@iota/types'
import { BuildBasicOutputData } from '@iota/wallet/out/types/buildOutputData'

export async function buildBasicOutput(id: string, data: BuildBasicOutputData): Promise<IBasicOutput> {
    return (await getAccount(Number(id)))?.buildBasicOutput(data)
}
