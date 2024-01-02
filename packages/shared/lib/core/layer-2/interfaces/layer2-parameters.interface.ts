import { BigInteger } from 'big-integer'

export interface ILayer2Parameters {
    networkAddress: string
    senderAddress: string
    gasFee?: BigInteger
}
