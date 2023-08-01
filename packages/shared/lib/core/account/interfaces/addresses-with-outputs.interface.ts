import { OutputData } from '@iota/wallet'

export interface AddressWithOutputs {
    address: string
    outputs: OutputData[]
}
