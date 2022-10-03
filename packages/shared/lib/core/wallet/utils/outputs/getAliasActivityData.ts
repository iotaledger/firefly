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
    convertHexAddressToBech32,
} from '..'
import { ActivityType } from '@core/wallet/enums'
import { ADDRESS_TYPE_ALIAS, NEW_ALIAS_ID, OUTPUT_TYPE_ALIAS } from '@core/wallet/constants'
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
        const isNewAlias = output.aliasId === NEW_ALIAS_ID
        if (isNewAlias) {
            const hexEncodedOutputId =
                '0x' + Converter.bytesToHex(Blake2b.sum256(Converter.hexToBytes(outputId.substring(2))))
            return convertHexAddressToBech32(ADDRESS_TYPE_ALIAS, hexEncodedOutputId)
        } else {
            return output.aliasId
        }
    } else {
        return ''
    }
}
