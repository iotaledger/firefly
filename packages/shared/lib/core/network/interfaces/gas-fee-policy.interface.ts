export interface IGasFeePolicy {
    gasPerToken: {
        [name: string]: number
    }
    validatorFeeShare: number
    evmGasRatio: {
        [name: string]: number
    }
}
