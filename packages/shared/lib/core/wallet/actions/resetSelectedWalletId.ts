import { selectedWalletId } from "../stores/selected-wallet-id.store";

export function resetSelectedWalletId(): void {
    selectedWalletId.set(null)
}
