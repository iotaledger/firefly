import { IAccountState } from '@core/account/interfaces'

export async function createAliasIfNecessary(account: IAccountState): Promise<void> {
    const { aliases } = await account.getBalance()
    if (aliases.length === 0) {
        await account.prepareCreateAliasOutput()
        await new Promise((resolve) => setTimeout(resolve, 7500))
    }
}
