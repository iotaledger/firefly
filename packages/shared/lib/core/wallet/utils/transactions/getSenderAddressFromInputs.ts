import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import {
    AddressUnlockCondition,
    AccountOutput,
    CommonOutput,
    ExpirationUnlockCondition,
    UnlockConditionType,
    AccountAddress,
} from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'
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
                    return getBech32AddressFromAddressTypes(expirationUnlockCondition.returnAddress)
                }
            }
        }

        const addressUnlockCondition = unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UnlockConditionType.Address
        ) as AddressUnlockCondition

        if (addressUnlockCondition) {
            return getBech32AddressFromAddressTypes(addressUnlockCondition.address)
        }

        // TODO: if additional metadata is added to an aliasOutput, we could use it to determine the EVM Sender.
        const accountId = (output as AccountOutput)?.accountId

        if (accountId) {
            return getBech32AddressFromAddressTypes(new AccountAddress(accountId))
        }
    }

    return undefined
}
