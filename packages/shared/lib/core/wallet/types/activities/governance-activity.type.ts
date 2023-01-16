import { ActivityType, GovernanceAction } from '@core/wallet/enums'
import { IParticipation } from '@core/wallet/interfaces'
import { BaseActivity } from './base-activity.type'

export type GovernanceActivity = BaseActivity & {
    type: ActivityType.Governance
    governanceAction: GovernanceAction
    votingPower: number
    participation?: IParticipation
    votingPowerDifference?: number
}
