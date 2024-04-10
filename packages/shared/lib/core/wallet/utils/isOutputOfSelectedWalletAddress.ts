import { CommonOutput, UnlockConditionType, OutputData, AddressUnlockCondition } from '@iota/sdk/out/types'
import { selectedWallet } from '../stores'
import { get } from 'svelte/store'
import { AddressConverter } from './AddressConverter'

export async function isOutputOfSelectedWalletAddress(outputData: OutputData): Promise<boolean> {
    const output = outputData.output as CommonOutput
    const walletAddress = await get(selectedWallet)?.address()
    const address = (
        output.unlockConditions.find(
            (unlockCondition) => unlockCondition.type === UnlockConditionType.Address
        ) as AddressUnlockCondition
    ).address
    const bech32Address = AddressConverter.addressToBech32(address)
    return bech32Address === walletAddress
}
