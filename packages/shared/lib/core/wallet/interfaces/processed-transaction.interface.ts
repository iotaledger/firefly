import { ActivityDirection, InclusionState } from '@core/wallet/enums'
import { IWrappedOutput } from './wrapped-output.interface'
import { CommonOutput, NftOutput, OutputType, UTXOInput } from '@iota/sdk/out/types'
import { getNativeTokenFromOutput, getNftId, getRecipientFromOutput, getSenderAddressFromInputs, getSenderFromTransaction, getSubjectFromAddress, isSubjectInternal } from '../utils'
import { IWalletState } from './wallet-state.interface'
import { SenderInfo } from '../types'

export interface IProcessedTransaction {
    outputs: IWrappedOutput[]
    transactionId: string
    direction: ActivityDirection
    time: Date
    inclusionState: InclusionState
    utxoInputs: UTXOInput[]
    wrappedInputs: IWrappedOutput[]
    claimingData?: IClaimData
}

export interface IClaimData {
    claimedDate: Date
    claimingTransactionId: string
}

export class ProcessedTransaction {
    constructor(public outputs: IWrappedOutput[],
        public transactionId: string,
        public direction: ActivityDirection,
        public time: Date,
        public inclusionState: InclusionState,
        public utxoInputs: UTXOInput[],
        public wrappedInputs: IWrappedOutput[],
        public claimingData?: IClaimData) { }


getSendingInformation(
    wallet: IWalletState,
    output: CommonOutput,
): SenderInfo {

    const recipient = getRecipientFromOutput(output)
    const sender = this.wrappedInputs?.length
        ? getSubjectFromAddress(getSenderAddressFromInputs(wrappedInputs)) // TODO: Fix this
        : getSenderFromTransaction(this.direction === ActivityDirection.Incoming, wallet.depositAddress, output)

    const subject = this.direction === ActivityDirection.Incoming ? sender : recipient
    const isInternal = isSubjectInternal(subject)

    return {
        subject,
        isInternal,
    }
}

    getBurnedNftInputs(): IWrappedOutput[] {
        return this.wrappedInputs.filter((wrappedInput) => {
            const input = wrappedInput.output
            if (input.type === OutputType.Nft) {
                const nftInput = input as NftOutput
                const nftId = getNftId(nftInput.nftId, wrappedInput.outputId)

                const isIncludedInOutputs = this.outputs.some((output) => {
                    if (output.output.type === OutputType.Nft) {
                        const nftOutput = output.output as NftOutput
                        return getNftId(nftOutput.nftId, output.outputId) === nftId
                    } else {
                        return false
                    }
                })

                return !isIncludedInOutputs
            } else {
                return false
            }
        })
    }


    getBurnedNativeTokens(): { assetId: string; amount: number } | undefined {
        // If the transaction is unblanced and there is a surplus of native tokens on the
        // input side of the transaction: the transaction destroys tokens.
        if (this.direction !== ActivityDirection.SelfTransaction) {
            return
        }

        const inputNativeTokens: { [key: string]: number } = ProcessedTransaction.getAllNativeTokensFromOutputs(
            this.wrappedInputs
        )
        // No burned native tokens if input doesn't contain any native tokens
        if (Object.keys(inputNativeTokens).length === 0) {
            return
        }

        const outputNativeTokens: { [key: string]: number } = ProcessedTransaction.getAllNativeTokensFromOutputs(this.outputs)
        // Find missing native tokens in outputNativeTokens (ex. input native tokens count === 3, output native tokens count === 2)
        // TO DO: adjust UI to account for burining entire amounts of multiple native tokens in one transaction.
        // We assume here that transaction burns entire amount of only one token.
        // There may be transactions created outside of FF that burn entire amount for multiple tokens from the input side
        // (ex.input native tokens count === 3, output native tokens count === 0)
        let burnedTokenKeys: string[] = Object.keys(inputNativeTokens).filter((key) => !(key in outputNativeTokens))
        if (Object.keys(burnedTokenKeys).length > 0) {
            return { assetId: burnedTokenKeys[0], amount: inputNativeTokens[burnedTokenKeys[0]] }
        }
        // Check if the amount of output native token was larger on the input side (partially burned native tokens)
        burnedTokenKeys = Object.keys(outputNativeTokens).filter((key) => outputNativeTokens[key] < inputNativeTokens[key])
        if (Object.keys(burnedTokenKeys).length > 0) {
            const burnedAmount = inputNativeTokens[burnedTokenKeys[0]] - Number(outputNativeTokens[burnedTokenKeys[0]])
            return { assetId: burnedTokenKeys[0], amount: burnedAmount }
        }
    }


    static getAllNativeTokensFromOutputs(outputs: IWrappedOutput[]): { [key: string]: number } {
        const nativeTokens: { [key: string]: number } = {}
        for (const output of outputs) {
            if (output.output.type === OutputType.Foundry || output.output.type === OutputType.Basic) {
                const commonOutput = output.output as CommonOutput
                const nativeToken = getNativeTokenFromOutput(commonOutput)
                if (nativeToken) {
                    if (!nativeTokens[nativeToken.id]) {
                        nativeTokens[nativeToken.id] = 0
                    }

                    nativeTokens[nativeToken.id] += Number(nativeToken.amount)
                }
            }
        }
        return nativeTokens
    }
}