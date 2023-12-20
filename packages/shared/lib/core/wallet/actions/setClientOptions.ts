import { ClientOptions } from '@core/network'
import { getSelectedWallet } from '../stores'

export async function setClientOptions(clientOptions: Partial<ClientOptions>): Promise<void> {
    const wallet = getSelectedWallet()

    await wallet.setClientOptions(clientOptions)
}
