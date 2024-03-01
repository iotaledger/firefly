import { OutputData, OutputType } from '@iota/sdk/out/types'

export function isAccountOutput(output: OutputData): boolean {
    return output?.output?.type === OutputType.Account
}
