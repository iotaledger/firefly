import { IWrappedOutput } from '@core/wallet/interfaces'
import { AddressConverter } from '../AddressConverter'
import {
    AddressUnlockCondition,
    AccountOutput,
    CommonOutput,
    ExpirationUnlockCondition,
    UnlockConditionType,
    AccountAddress,
} from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'

export function getSenderAddressFromInputs(inputs: IWrappedOutput[]): string | undefined {
    for (const input of inputs) {
        const { output, metadata } = input
        const unlockConditions = (output as CommonOutput)?.unlockConditions

        const nodeParamenters = get(nodeInfoProtocolParameters)
        if (nodeParamenters && metadata?.spent?.slot) {
            const spentDate = getUnixTimestampFromNodeInfoAndSlotIndex(nodeParamenters, metadata?.spent?.slot)
            if (spentDate) {
                // A transaction with an expiration unlock condition is included if the transaction expired
                const expirationUnlockCondition = unlockConditions.find(
                    (unlockCondition) =>
                        unlockCondition.type === UnlockConditionType.Expiration &&
                        (unlockCondition as ExpirationUnlockCondition).slotIndex < spentDate
                ) as ExpirationUnlockCondition

                if (expirationUnlockCondition) {
                    return AddressConverter.addressToBech32(expirationUnlockCondition.returnAddress)
                }
            }
        }

        const addressUnlockCondition = unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UnlockConditionType.Address
        ) as AddressUnlockCondition

        if (addressUnlockCondition) {
            return AddressConverter.addressToBech32(addressUnlockCondition.address)
        }

        // TODO: if additional metadata is added to an accountOutput, we could use it to determine the EVM Sender.
        const accountId = (output as AccountOutput)?.accountId

        if (accountId) {
            return AddressConverter.addressToBech32(new AccountAddress(accountId))
        }
    }

    return undefined
}
