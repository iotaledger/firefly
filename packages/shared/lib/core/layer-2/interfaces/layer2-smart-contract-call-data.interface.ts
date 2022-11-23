export interface ILayer2SmartContractCallData {
    senderContract: string
    targetContract: string
    contractFunction: string
    gasBudget: bigInt.BigInteger
}
