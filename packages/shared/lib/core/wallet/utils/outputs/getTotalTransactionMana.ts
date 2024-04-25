import { IWrappedOutput } from '../../interfaces'
import {
    AccountAddress,
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

export async function getTotalTransactionMana(
    inputs: IWrappedOutput[],
    outputs: IWrappedOutput[],
    wallet: IWalletState,
    transactionSlot: number,
    transactionTimestamp: number
): Promise<number> {
    const walletAddress = await wallet.address()
    const implicitAddress = await wallet.implicitAccountCreationAddress()
    // We are ignoring accounts that the wallet may have had in the past
    const currentAccountsAddresses = (await wallet.accounts()).map((accountInput) =>
        AddressConverter.addressToBech32(
            new AccountAddress((accountInput.output as unknown as AccountOutput).accountId)
        )
    )

    const addressToConsiderWhenCalculatingMana = [...currentAccountsAddresses, implicitAddress, walletAddress]

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
