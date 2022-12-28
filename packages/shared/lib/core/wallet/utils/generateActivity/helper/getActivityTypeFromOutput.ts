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
            return ActivityType.Basic
    }
}
