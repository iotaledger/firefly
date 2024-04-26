import { AccountAddress, AccountOutput } from '@iota/sdk/out/types'
import { IWallet } from '../../profile'
import { AddressConverter } from './AddressConverter'

export async function getInvolvedAddresses(wallet: IWallet): Promise<string[]> {
    const walletAddress = await wallet.address()
    const implicitAddress = await wallet.implicitAccountCreationAddress()
    // We are ignoring accounts that the wallet may have had in the past
    const currentAccountsAddresses = (await wallet.accounts()).map((accountInput) =>
        AddressConverter.addressToBech32(
            new AccountAddress((accountInput.output as unknown as AccountOutput).accountId)
        )
    )

    return [...currentAccountsAddresses, implicitAddress, walletAddress]
}
