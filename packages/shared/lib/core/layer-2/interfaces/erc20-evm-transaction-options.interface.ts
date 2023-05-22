export interface IErc20EvmTransactionOptions {
    chainId: number
    tokenAddress: string
    originAddress: string
    recipientAddress: string
    transferAmount: number
}
