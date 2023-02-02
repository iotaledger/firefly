import { isParticipationOutput } from '@contexts/governance/utils'
import { OUTPUT_TYPE_ALIAS, OUTPUT_TYPE_BASIC, OUTPUT_TYPE_FOUNDRY, OUTPUT_TYPE_NFT } from '@core/wallet/constants'
import { ActivityType } from '@core/wallet/enums'
import { IWrappedOutput } from '@core/wallet/interfaces'

export function getActivityTypeFromOutput(output: IWrappedOutput): ActivityType {
    switch (output.output.type) {
        case OUTPUT_TYPE_NFT:
            return ActivityType.Nft
        case OUTPUT_TYPE_ALIAS:
            return ActivityType.Alias
        case OUTPUT_TYPE_FOUNDRY:
            return ActivityType.Foundry
        case OUTPUT_TYPE_BASIC:
            if (isParticipationOutput(output.output)) {
                return ActivityType.Governance
            } else {
                return ActivityType.Basic
            }
    }
}
