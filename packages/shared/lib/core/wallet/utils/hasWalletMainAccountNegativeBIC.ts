import { IWalletState } from '..'

export function hasWalletMainAccountNegativeBIC(wallet: IWalletState | undefined): boolean {
    if (!wallet || !wallet.mainAccountId) return false
    return wallet.balances?.blockIssuanceCredits?.[wallet.mainAccountId] < 0
}
