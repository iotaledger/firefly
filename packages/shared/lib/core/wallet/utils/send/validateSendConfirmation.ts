import { InvalidExpirationDateTimeError } from '@contexts/wallet'
import { convertUnixTimestampToDate, isValidExpirationDateTime } from '@core/utils'
import { CommonOutput, ExpirationUnlockCondition, UnlockConditionType } from '@iota/sdk/out/types'
import { nodeInfoProtocolParameters } from 'shared/lib/core/network'
import { getTimestampFromNodeInfoAndSlotIndex } from 'shared/lib/core/network/helpers/getSlotInfoFromNodeProtocolParameters'
import { get } from 'svelte/store'

export function validateSendConfirmation(output: CommonOutput): void {
    const expirationUnlockCondition = output.unlockConditions.find(
        (c) => c.type === UnlockConditionType.Expiration
    ) as ExpirationUnlockCondition
    const nodeProtocolParameters = get(nodeInfoProtocolParameters)
    if (!nodeProtocolParameters) return
    const expirationUnixTime = getTimestampFromNodeInfoAndSlotIndex(
        nodeProtocolParameters,
        expirationUnlockCondition.slotIndex
    )
    const expirationDateTime = expirationUnixTime ? convertUnixTimestampToDate(expirationUnixTime) : undefined

    if (expirationDateTime && !isValidExpirationDateTime(expirationDateTime)) {
        throw new InvalidExpirationDateTimeError()
    }
}
