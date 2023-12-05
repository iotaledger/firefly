import { IWalletState } from '@core/wallet/interfaces'
import { ActivityType } from '@core/wallet/enums'
import { getNativeTokenFromOutput, isOutputAsync } from '..'
import { IWrappedOutput } from '../../interfaces'
import { getActivityTypeFromOutput, getAmountFromOutput, getStorageDepositFromOutput } from '../generateActivity/helper'
import { BasicOutput } from '@iota/sdk/out/types'

export async function activityOutputContainsValue(
    wallet: IWalletState,
    wrappedOutput: IWrappedOutput
): Promise<boolean> {
    const type = getActivityTypeFromOutput(wrappedOutput)
    const typesToCheck = [ActivityType.Basic]
    if (typesToCheck.includes(type)) {
        const output = wrappedOutput.output as BasicOutput

        const isAsync = isOutputAsync(output)
        const nativeToken = await getNativeTokenFromOutput(output)

        const { storageDeposit } = await getStorageDepositFromOutput(wallet, output)
        const rawAmount = getAmountFromOutput(output) - storageDeposit
        return !isAsync || rawAmount > 0 || (!!nativeToken && Number(nativeToken.amount) > 0)
    } else {
        return true
    }
}
