import { Subject } from '@core/wallet/types'
import { OutputTypes } from '@iota/types'
import { getSenderFromOutput } from '../outputs'

export function getSenderFromTransaction(isIncoming: boolean, accountAddress: string, output: OutputTypes): Subject {
    if (isIncoming) {
        return getSenderFromOutput(output)
    } else {
        return { type: 'address', address: accountAddress }
    }
}
