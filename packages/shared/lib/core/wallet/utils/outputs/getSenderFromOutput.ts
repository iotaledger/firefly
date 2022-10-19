import { IBasicOutput, IAliasOutput, IFoundryOutput, INftOutput } from '@iota/types'
import { Subject } from '../../types'
import { getSubjectFromAddress } from '../getSubjectFromAddress'
import { getSenderAddressFromUnlockCondition } from '../getSenderAddressFromUnlockCondition'

export function getSenderFromOutput(output: IBasicOutput | IAliasOutput | IFoundryOutput | INftOutput): Subject {
    for (const unlockCondition of output.unlockConditions) {
        const senderAddress = getSenderAddressFromUnlockCondition(unlockCondition)
        if (senderAddress) {
            return getSubjectFromAddress(senderAddress)
        }
    }
}
