import { IWallet } from '@core/profile/interfaces'

// TODO(2.0) Fix all usages
export function getDepositAddress(wallet: IWallet): Promise<string> {
    return wallet.address()
}
