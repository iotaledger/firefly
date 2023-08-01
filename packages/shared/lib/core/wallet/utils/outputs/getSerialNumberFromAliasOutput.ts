import { get } from 'svelte/store'
import { selectedAccount } from '@core/account/stores'
import { convertBech32ToHexAddress } from '@core/wallet/utils/convertBech32ToHexAddress'
import { IAliasOutput } from '@iota/types'

export async function getSerialNumberFromAliasOutput(aliasAddress: string): Promise<number> {
    const account = get(selectedAccount)
    if (!account) {
        throw new Error('Account is undefined')
    }
    const aliasId = convertBech32ToHexAddress(aliasAddress)

    const [aliasOutput] = await account.unspentOutputs({ aliasIds: [aliasId] })

    // If it's the first state transition of the alias address, the aliasId is 0x0.
    // So we set the foundry counter to 0.
    const foundryCounter = aliasOutput ? (aliasOutput.output as IAliasOutput).foundryCounter : 0
    return foundryCounter + 1
}
