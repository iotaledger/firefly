import { IWalletState } from '../interfaces'

export function sumBalanceForWallets(wallets: IWalletState[]): number {
    return wallets.reduce((total: number, wallet: IWalletState) => (total += Number(wallet.balances.baseCoin.total)), 0)
}
