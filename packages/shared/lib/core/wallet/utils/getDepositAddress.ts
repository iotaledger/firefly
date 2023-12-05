import { IWallet } from "@core/profile/interfaces";

// TODO(2.0) Fix all usages
export async function getDepositAddress(wallet: IWallet): Promise<string> {
    return await wallet.address();
}
