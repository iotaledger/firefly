import {
    UnlockConditionType,
    AddressUnlockCondition,
    AccountOutput,
    CommonOutput,
    AccountAddress,
    OutputData,
} from '@iota/sdk/out/types'
import { get } from 'svelte/store'
import { selectedWallet } from '../stores'
import { isOutputExpired, isOutputTimeLocked } from './outputs'

// TODO: Update logic when https://github.com/iotaledger/iota-sdk/issues/1907 is merged
export function getAccountBalance(accountOutput: AccountOutput): number {
    const accountAmount = Number(accountOutput.amount)
    const wallet = get(selectedWallet)
    const unspentOutputs = wallet?.walletUnspentOutputs || []
    const accountAddress = new AccountAddress(accountOutput.accountId)
    const accountUnspentOutputs = findOutputsByAddresUnlockCondition(unspentOutputs, accountAddress)
    return accountUnspentOutputs.reduce((acc, output) => {
        const commonOuptut = output.output as CommonOutput
        // TODO: also check the outputs of the outputs
        if (
            commonOuptut.unlockConditions.find(
                (unlockCondition) => unlockCondition.type === UnlockConditionType.Expiration
            ) &&
            isOutputExpired(commonOuptut)
        ) {
            return acc
        }
        if (
            commonOuptut.unlockConditions.find(
                (unlockCondition) => unlockCondition.type === UnlockConditionType.Timelock
            ) &&
            isOutputTimeLocked(output)
        ) {
            return acc
        }
        return acc + Number(commonOuptut?.amount)
    }, accountAmount)
}

function findOutputsByAddresUnlockCondition(outputsData: OutputData[], address: AccountAddress): OutputData[] {
    return (
        outputsData?.filter((outputData) => {
            const commonOutput = outputData.output as CommonOutput
            const addressUnlockCondition = commonOutput?.unlockConditions?.find(
                (unlockCondition) => unlockCondition.type === UnlockConditionType.Address
            ) as AddressUnlockCondition
            return (addressUnlockCondition.address as AccountAddress)?.accountId === address.accountId
        }) || []
    )
}
