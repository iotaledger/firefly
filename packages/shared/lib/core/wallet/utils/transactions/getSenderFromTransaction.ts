import { Subject } from '@core/wallet/types'
import { IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { getSenderFromOutput } from '../outputs/getSenderFromOutput'

export function getSenderFromTransaction(
    isIncoming: boolean,
    accountAddress: string,
    output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput
): Subject {
    if (isIncoming) {
        return getSenderFromOutput(output)
    } else {
        return { type: 'address', address: accountAddress }
    }
}
