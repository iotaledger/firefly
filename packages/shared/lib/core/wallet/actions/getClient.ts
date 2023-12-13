import { Client } from '@iota/sdk/out/client'
import { getSelectedWallet } from '@core/wallet/stores'

export function getClient(): Promise<Client> {
    const wallet = getSelectedWallet();
    console.log("wallet in getClient", wallet);

    return wallet!.getClient()
}
