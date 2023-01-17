import { ActivityType, GovernanceAction } from '@core/wallet/enums'
import { BaseActivity } from './base-activity.type'

export type GovernanceActivity = BaseActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: number
    votingPowerDifference?: number
}
