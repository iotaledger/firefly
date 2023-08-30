import { Subject } from '@core/wallet/types'
import { CommonOutput } from '@iota/sdk/out/types'
import { getSenderFromOutput } from '../outputs/getSenderFromOutput'

export function getSenderFromTransaction(
    isIncoming: boolean,
    accountAddress: string,
    output: CommonOutput
): Subject | undefined {
    if (isIncoming) {
        return getSenderFromOutput(output)
    } else {
        return { type: 'address', address: accountAddress }
    }
}
