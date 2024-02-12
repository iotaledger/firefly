import { OutputData } from '@iota/sdk'
import { get } from 'svelte/store'
import { selectedWallet } from '../stores'

export function isAnImplicitAccount(output: OutputData): OutputData | undefined {
    return get(selectedWallet)?.implicitAccountOutputs.find((account) => account.outputId === output.outputId)
}
