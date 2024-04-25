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

export function getSenderAddressFromInputs(inputs: IWrappedOutput[]): string | undefined {
    for (const input of inputs) {
        const { output, metadata } = input
        const unlockConditions = (output as CommonOutput)?.unlockConditions

        const spentSlot = metadata?.spent?.slot;

        if (spentSlot) {
             // A transaction with an expiration unlock condition is included if the transaction expired
             const expirationUnlockCondition = unlockConditions.find(
                (unlockCondition) =>
                    unlockCondition.type === UnlockConditionType.Expiration &&
                    (unlockCondition as ExpirationUnlockCondition).slot < spentSlot
            ) as ExpirationUnlockCondition

            if (expirationUnlockCondition) {
                return AddressConverter.addressToBech32(expirationUnlockCondition.returnAddress)
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
