import { IAccount } from '@core/account'

export async function getDepositAddress(account: IAccount): Promise<string> {
    const addresses = await account.addresses()
    const address = addresses.find((address) => address.internal === false && address.keyIndex === 0)
    return address.address
}
