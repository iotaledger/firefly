import { OutputData } from '@iota/sdk'
import { get } from 'svelte/store'
import { selectedWallet } from '../stores'

export function isAccountOutput(output: OutputData): boolean {
    return get(selectedWallet)?.accountOutputs?.find((account) => account.outputId === output.outputId)
}
