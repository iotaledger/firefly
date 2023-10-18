import { isParticipationOutput } from '@contexts/governance/utils'
import { isVestingOutputId } from '@contexts/vesting'
import { ActivityType } from '@core/wallet/enums'
import { IWrappedOutput } from '@core/wallet/interfaces'
import { OutputType } from '@iota/sdk/out/types'

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
            } else if (isVestingOutputId(output.outputId)) {
                return ActivityType.Vesting
            } else {
                return ActivityType.Basic
            }
    }
}
