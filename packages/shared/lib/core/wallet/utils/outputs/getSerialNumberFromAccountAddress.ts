import { get } from 'svelte/store'
import { AccountOutput } from '@iota/sdk/out/types'
import { selectedWallet } from '../../stores'

export async function getSerialNumberFromAccountAddress(accountId: string): Promise<number> {
    const wallet = get(selectedWallet)
    if (!wallet) {
        throw new Error('Wallet is undefined')
    }
    const [accountOutput] = await wallet.unspentOutputs({ accountIds: [accountId] })

    // If it's the first state transition of the account address, the accountId is 0x0.
    // So we set the foundry counter to 0.
    const foundryCounter = accountOutput ? (accountOutput.output as AccountOutput).foundryCounter : 0
    return foundryCounter + 1
}
