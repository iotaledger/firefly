import { NETWORK, nodeInfo } from '@core/network'
import { OutputTypes } from '@iota/types'
import { Converter } from '@lib/converter'
import { Bech32Helper } from '@lib/bech32Helper'
import { get } from 'svelte/store'
import { ADDRESS_TYPE_ED25519, OUTPUT_TYPE_BASIC, UNLOCK_CONDITION_ADDRESS } from '../constants'
import { activeProfile } from '@core/profile'

export function getRecipientAddressFromOutput(output: OutputTypes): string {
    if (
        output.type === OUTPUT_TYPE_BASIC &&
        output.unlockConditions[0].type === UNLOCK_CONDITION_ADDRESS &&
        output.unlockConditions[0].address.type === ADDRESS_TYPE_ED25519
    ) {
        return Bech32Helper.toBech32(
            0,
            Converter.hexToBytes(output.unlockConditions[0].address.pubKeyHash.substring(2)),
            get(nodeInfo)?.protocol?.bech32HRP ??
                NETWORK?.[get(activeProfile)?.networkProtocol]?.[get(activeProfile)?.networkType]?.bech32Hrp ??
                ''
        )
    }
    return undefined
}
