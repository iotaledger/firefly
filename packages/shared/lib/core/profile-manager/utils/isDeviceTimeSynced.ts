import { getNodeInfo } from '../api'
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from '@lib/time'

const ACCEPTABLE_RANGE_IN_MINUTES = 5

export async function isDeviceTimeSynced(): Promise<boolean> {
    const latestMilestoneTimestampInSeconds = (await getNodeInfo())?.nodeInfo.status.latestMilestone.timestamp
    const deviceTimestampInSeconds = Date.now() / MILLISECONDS_PER_SECOND

    const diffInSeconds = Math.abs(latestMilestoneTimestampInSeconds - deviceTimestampInSeconds)
    const diffInMinutes = diffInSeconds / SECONDS_PER_MINUTE

    return diffInMinutes <= ACCEPTABLE_RANGE_IN_MINUTES
}
