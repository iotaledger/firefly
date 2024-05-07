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

export function getSenderAddressFromInputs(inputs: IWrappedOutput[], txSlot: number): string | undefined {
    for (const input of inputs) {
        const { output } = input
        const unlockConditions = (output as CommonOutput)?.unlockConditions

        // A transaction with an expiration unlock condition is included if the transaction expired
        const expiredExpirationUnlockCondition = unlockConditions.find(
            (unlockCondition) =>
                unlockCondition.type === UnlockConditionType.Expiration &&
                (unlockCondition as ExpirationUnlockCondition).slot < txSlot
        ) as ExpirationUnlockCondition

        if (expiredExpirationUnlockCondition) {
            return AddressConverter.addressToBech32(expiredExpirationUnlockCondition.returnAddress)
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
