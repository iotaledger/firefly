import { OutputData } from '@iota/sdk/out/types'

export interface AddressWithOutputs {
    address: string
    outputs: OutputData[]
}
