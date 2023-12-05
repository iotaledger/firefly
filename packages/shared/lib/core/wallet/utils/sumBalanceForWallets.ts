import { IWalletState } from "../interfaces";

// TODO(2.0) Fix all usages
export function sumBalanceForWallets(wallets: IWalletState[]): number {
    return wallets.reduce(
        (total: number, wallet: IWalletState) => (total += Number(wallet.balances.baseCoin.total)),
        0
    )
}
