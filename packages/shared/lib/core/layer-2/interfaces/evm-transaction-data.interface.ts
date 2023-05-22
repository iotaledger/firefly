export interface IEvmTransactionData {
    nonce: string | number
    gasPrice: string | number
    gasLimit: string | number
    to: string
    value: string | number
    data: string
    v?: string
    r?: string
    s?: string
    type?: string
}
