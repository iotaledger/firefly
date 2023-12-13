import { ClientOptions } from '@core/network'
import { getSelectedWallet } from '../stores'

export async function setClientOptions(clientOptions: Partial<ClientOptions>): Promise<void> {
    const wallet = getSelectedWallet();
    console.log("wallet in setClientOptions", wallet);
    
    await wallet.setClientOptions(clientOptions)
}
