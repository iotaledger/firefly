import { IWrappedOutput } from '../../interfaces'
import {
    AccountOutput,
    AnchorOutput,
    BasicOutput,
    CommonOutput,
    ExpirationUnlockCondition,
    NftOutput,
    OutputData,
    UnlockConditionType,
} from '@iota/sdk/out/types'
import { IWalletState } from '@core/wallet/interfaces'
import { getPassiveManaForOutput } from '@core/network'
import { isOutputUnlockedByAddress } from '../isOutputUnlockedByAddress'
import { AddressConverter } from '../AddressConverter'
import { getExpirationDateFromOutput } from './getExpirationDateFromOutput'
import { getInvolvedAddresses } from '../getInvolvedAddresses'

export async function getTotalTransactionMana(
    inputs: IWrappedOutput[],
    outputs: IWrappedOutput[],
    wallet: IWalletState,
    transactionSlot: number,
    transactionTimestamp: number
): Promise<number> {
    const addressToConsiderWhenCalculatingMana = await getInvolvedAddresses(wallet)

    const inputsToConsiderWhenCalculatingMana = inputs.filter((input) => {
        const commonInput = input.output as CommonOutput
        const ownTransaction = addressToConsiderWhenCalculatingMana.find((address) =>
            isOutputUnlockedByAddress(commonInput, address)
        )

        return (
            !!ownTransaction ||
            hasOwnedOutputWithExpirationTimeExpired(
                commonInput,
                new Date(transactionTimestamp),
                addressToConsiderWhenCalculatingMana,
                !!ownTransaction
            )
        )
    })

    const outputsToConsiderWhenCalculatingMana = outputs.filter((output) =>
        addressToConsiderWhenCalculatingMana.find((address) =>
            isOutputUnlockedByAddress(output.output as CommonOutput, address)
        )
    )

    const prevManaCost = inputsToConsiderWhenCalculatingMana.reduce(
        (acc, input) => acc + (getPassiveManaForOutput(input as OutputData, transactionSlot) ?? 0),
        0
    )

    const postManaCost = outputsToConsiderWhenCalculatingMana.reduce(
        (acc, output) =>
            acc + Number((output.output as BasicOutput | AccountOutput | AnchorOutput | NftOutput).mana ?? 0),
        0
    )

    return postManaCost - prevManaCost
}

function hasOwnedOutputWithExpirationTimeExpired(
    output: CommonOutput,
    transactionTimestamp: Date,
    ownAdresses: string[],
    ownTransaction: boolean
): boolean {
    const expirationDate = getExpirationDateFromOutput(output)
    if (!expirationDate) return false

    const expirationUnlockCondition = output.unlockConditions.find(
        (uc) => uc.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const addressExpireUnlockCondition = AddressConverter.addressToBech32(expirationUnlockCondition.returnAddress)
    const isOwnAddress = ownAdresses.includes(addressExpireUnlockCondition)
    const isExpired = expirationDate.getTime() < transactionTimestamp.getTime()

    return (isOwnAddress && !isExpired) || (!isOwnAddress && isExpired && ownTransaction)
}
