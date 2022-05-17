import { Address, AddressGenerationOptions } from '@iota/wallet'
import { getAccount } from '@core/profile-manager'

export async function generateAddressesFromAccount(
    accountId: string,
    amount: number,
    options?: AddressGenerationOptions
): Promise<Address[]> {
    return (await getAccount(Number(accountId)))?.generateAddresses(amount, options)
}
