import { OutputData, OutputType } from '@iota/sdk/out/types'

export function isDelegationOutput(output: OutputData): boolean {
    return output?.output?.type === OutputType.Delegation
}
