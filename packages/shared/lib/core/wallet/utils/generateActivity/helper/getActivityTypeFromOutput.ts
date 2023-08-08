import { isParticipationOutput } from '@contexts/governance/utils'
import { ActivityType } from '@core/wallet/enums'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { OutputType } from '@iota/wallet/out/types'

export function getActivityTypeFromOutput(output: IWrappedOutput): ActivityType {
    switch (output.output.type) {
        case OutputType.Nft:
            return ActivityType.Nft
        case OutputType.Alias:
            return ActivityType.Alias
        case OutputType.Foundry:
            return ActivityType.Foundry
        case OutputType.Basic:
            if (isParticipationOutput(output.output)) {
                return ActivityType.Governance
            } else {
                return ActivityType.Basic
            }
    }
}
