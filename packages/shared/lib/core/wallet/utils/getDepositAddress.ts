import { IWallet } from '@core/profile/interfaces'

// TODO(2.0): the implementation is incorrect, the deposit address should be the address of the selected block issuer account output , not the ed25519 address
export function getDepositAddress(wallet: IWallet): Promise<string> {
    return wallet.address()
}
