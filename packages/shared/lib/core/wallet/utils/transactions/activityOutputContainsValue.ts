import { ActivityType } from '@core/wallet/enums'
import { IBasicOutput } from '@iota/types'
import { getNativeTokenFromOutput, isOutputAsync } from '..'
import { IWrappedOutput } from '../../interfaces'
import { getAmountFromOutput, getStorageDepositFromOutput } from '../generateActivity/helper'

export function activityOutputContainsValue(type: ActivityType, wrappedOutput: IWrappedOutput): boolean {
    const typesToCheck = [ActivityType.Basic]
    if (typesToCheck.includes(type)) {
        const output = wrappedOutput.output as IBasicOutput

        const isAsync = isOutputAsync(output)
        const nativeToken = getNativeTokenFromOutput(output)

        const { storageDeposit } = getStorageDepositFromOutput(output)
        const rawAmount = getAmountFromOutput(output) - storageDeposit
        return !isAsync || rawAmount > 0 || (!!nativeToken && Number(nativeToken.amount) > 0)
    } else {
        return true
    }
}
