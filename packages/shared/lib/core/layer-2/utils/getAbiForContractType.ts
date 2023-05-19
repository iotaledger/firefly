import { ERC20_ABI, ISC_SANDBOX_ABI } from '../abis'
import { ContractType } from '../enums'
import { Abi } from '../types'

export function getAbiForContractType(type: ContractType): Abi {
    switch (type) {
        case ContractType.IscMagic:
            return ISC_SANDBOX_ABI
        case ContractType.Erc20:
            return ERC20_ABI
        default:
            return []
    }
}
