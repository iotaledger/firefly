import { ILayer2TransferAllowanceMetadata } from '../interfaces'

export type Layer2Metadata = Omit<ILayer2TransferAllowanceMetadata, 'baseTokenAmount' | 'nativeTokens'>
