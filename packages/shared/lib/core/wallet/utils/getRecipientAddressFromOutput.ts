import { NETWORK, nodeInfo } from '@core/network'
import { OutputTypes, UnlockConditionTypes } from '@iota/types'
import { Converter } from '@lib/converter'
import { Bech32Helper } from '@lib/bech32Helper'
import { get } from 'svelte/store'
import {
    ADDRESS_TYPE_ED25519,
    OUTPUT_TYPE_BASIC,
    UNLOCK_CONDITION_ADDRESS,
    UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN,
} from '../constants'
import { activeProfile } from '@core/profile'

export function getRecipientAddressFromOutput(output: OutputTypes): string {
    if (output.type === OUTPUT_TYPE_BASIC) {
        return getRecipientAddressFromUnlockCondition(output.unlockConditions[0])
    }
    return undefined
}

export function getRecipientAddressFromUnlockCondition(unlockCondition: UnlockConditionTypes): string {
    let address = ''

    if (unlockCondition.type === UNLOCK_CONDITION_ADDRESS && unlockCondition.address.type === ADDRESS_TYPE_ED25519) {
        address = unlockCondition.address.pubKeyHash
    } else if (
        unlockCondition.type === UNLOCK_CONDITION_STORAGE_DEPOSIT_RETURN &&
        unlockCondition.returnAddress.type === ADDRESS_TYPE_ED25519
    ) {
        address = unlockCondition.returnAddress.pubKeyHash
    }

    const hrp =
        get(nodeInfo)?.protocol?.bech32HRP ??
        NETWORK?.[get(activeProfile)?.networkProtocol]?.[get(activeProfile)?.networkType]?.bech32Hrp ??
        ''

    return address ? Bech32Helper.toBech32(0, Converter.hexToBytes(address.substring(2)), hrp) : undefined
}
