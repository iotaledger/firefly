import { IWrappedOutput } from '@core/wallet/interfaces'
import { getBech32AddressFromAddressTypes } from '../getBech32AddressFromAddressTypes'
import {
    AddressUnlockCondition,
    AliasAddress,
    AliasOutput,
    CommonOutput,
    ExpirationUnlockCondition,
    UnlockConditionType,
} from '@iota/wallet/out/types'

export function getSenderAddressFromInputs(inputs: IWrappedOutput[]): string | undefined {
    for (const input of inputs) {
        const { output, metadata } = input
        const unlockConditions = (output as CommonOutput)?.getUnlockConditions()

        const spentDate = metadata?.milestoneTimestampSpent

        if (spentDate) {
            // A transaction with an expiration unlock condition is included if the transaction expired
            const expirationUnlockCondition = unlockConditions.find(
                (unlockCondition) =>
                    unlockCondition.getType() === UnlockConditionType.Expiration &&
                    (unlockCondition as ExpirationUnlockCondition).getUnixTime() < spentDate
            ) as ExpirationUnlockCondition

            if (expirationUnlockCondition) {
                return getBech32AddressFromAddressTypes(expirationUnlockCondition.getReturnAddress())
            }
        }

        const addressUnlockCondition = unlockConditions.find(
            (unlockCondition) => unlockCondition.getType() === UnlockConditionType.Address
        ) as AddressUnlockCondition

        if (addressUnlockCondition) {
            return getBech32AddressFromAddressTypes(addressUnlockCondition.getAddress())
        }

        // TODO: if additional metadata is added to an aliasOutput, we could use it to determine the EVM Sender.
        const aliasId = (output as AliasOutput)?.getAliasId()

        if (aliasId) {
            return getBech32AddressFromAddressTypes(new AliasAddress(aliasId))
        }
    }

    return undefined
}
