import { COIN_TYPE } from '@core/network'
import { activeProfile } from '@core/profile'
import { get } from 'svelte/store'
import { IProcessedTransaction, IAliasActivityData } from '../../interfaces'
import {
    getAmountFromOutput,
    getGovernorAddressFromOutput,
    getNativeTokenFromOutput,
    getStorageDepositFromOutput,
    getStateControllerAddressFromOutput,
    convertEd25519ToBech32,
} from '..'
import { ActivityType } from '@core/wallet/enums'
import { OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
import { OutputTypes } from '@iota/types'
import { Converter } from '@lib/converter'
import { Blake2b } from '@iota/crypto.js'

export function getAliasActivityData(processedTransaction: IProcessedTransaction): IAliasActivityData {
    const { outputs } = processedTransaction
    const { output, outputId } = outputs.find((output) => output.output.type === OUTPUT_TYPE_ALIAS)

    const nativeToken = getNativeTokenFromOutput(output)
    const assetId = nativeToken?.id ?? String(COIN_TYPE[get(activeProfile).networkProtocol])

    const storageDeposit = getAmountFromOutput(output) + getStorageDepositFromOutput(output).storageDeposit
    const governorAddress = getGovernorAddressFromOutput(output)
    const stateControllerAddress = getStateControllerAddressFromOutput(output)
    const aliasId = getAliasId(output, outputId)

    return {
        type: ActivityType.Alias,
        outputId,
        assetId,
        aliasId,
        storageDeposit,
        governorAddress,
        stateControllerAddress,
    }
}

function getAliasId(output: OutputTypes, outputId: string): string {
    if (output.type === OUTPUT_TYPE_ALIAS) {
        const isNewAlias = output.aliasId === '0x0000000000000000000000000000000000000000000000000000000000000000'
        if (isNewAlias) {
            const hexEncodedOutputId = Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId.substring(2))))
            return convertEd25519ToBech32(`0x${hexEncodedOutputId}`)
        } else {
            return output.aliasId
        }
    } else {
        return ''
    }
}
