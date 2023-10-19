import { Subject } from '@core/wallet/types'
import { CommonOutput } from '@iota/sdk/out/types'
import { getSenderFromOutput } from '../outputs/getSenderFromOutput'
import { SubjectType } from '@core/wallet/enums'

export function getSenderFromTransaction(
    isIncoming: boolean,
    accountAddress: string,
    output: CommonOutput
): Subject | undefined {
    if (isIncoming) {
        return getSenderFromOutput(output)
    } else {
        return { type: SubjectType.Address, address: accountAddress }
    }
}
