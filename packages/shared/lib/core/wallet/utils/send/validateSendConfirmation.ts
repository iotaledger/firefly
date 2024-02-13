import { InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { getUnixTimestampFromNodeInfoAndSlotIndex, nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { get } from 'svelte/store'

export function validateSendConfirmation(output: CommonOutput): void {
    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters || !expirationUnlockCondition) return
    const expirationUnixTime = getUnixTimestampFromNodeInfoAndSlotIndex(
        nodeProtocolParameters,
        expirationUnlockCondition.slotIndex
    )
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
