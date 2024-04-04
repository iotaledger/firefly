import { InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { CommonOutput, ExpirationUnlockCondition, SlotIndex, UnlockConditionType } from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from '@core/network'
import { get } from 'svelte/store'

// TODO: Remove temp interface -> https://github.com/iotaledger/firefly/issues/8305
interface ExpirationUnlockConditionTemp extends ExpirationUnlockCondition {
    slot: SlotIndex
}

export function validateSendConfirmation(output: CommonOutput): void {
    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockConditionTemp

    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters || !expirationUnlockCondition) return
    const expirationUnixTime = getUnixTimestampFromNodeInfoAndSlotIndex(
        nodeProtocolParameters,
        expirationUnlockCondition.slotIndex ?? expirationUnlockCondition.slot
    )
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
