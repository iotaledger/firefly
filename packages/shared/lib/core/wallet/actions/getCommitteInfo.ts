import { CommitteeResponse } from '@iota/sdk/out/types'
import { getClient } from './getClient'

export async function getCommitteeInfo(): Promise<CommitteeResponse> {
    const client = await getClient()
    return client.getCommittee()
}
