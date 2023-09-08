import { VestingType } from '../enums'
import { IVestingOutput } from './'

export interface AddressWithVestingOutputs {
    address: string
    outputs: IVestingOutput[]
    type: VestingType | undefined
}
