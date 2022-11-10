import { ADDRESS_TYPE_ALIAS } from '@core/wallet/constants'
import type { IFoundryOutput } from '@iota/types'
import { HexHelper, WriteStream } from '@iota/util.js'

export function buildFoundryId(foundry: IFoundryOutput): string {
    const immutableAliasUnlockCondition = foundry.unlockConditions[0]
    const aliasId =
        immutableAliasUnlockCondition.type === 6 && immutableAliasUnlockCondition.address.type === ADDRESS_TYPE_ALIAS
            ? immutableAliasUnlockCondition.address.aliasId
            : ''
    const typeWS = new WriteStream()
    typeWS.writeUInt8('alias address type', ADDRESS_TYPE_ALIAS)
    const aliasAddress = HexHelper.addPrefix(`${typeWS.finalHex()}${HexHelper.stripPrefix(aliasId)}`)
    const serialNumberWS = new WriteStream()
    serialNumberWS.writeUInt32('serialNumber', foundry.serialNumber)
    const serialNumberHex = serialNumberWS.finalHex()
    const tokenSchemeTypeWS = new WriteStream()
    tokenSchemeTypeWS.writeUInt8('tokenSchemeType', foundry.tokenScheme.type)
    const tokenSchemeTypeHex = tokenSchemeTypeWS.finalHex()

    return `${aliasAddress}${serialNumberHex}${tokenSchemeTypeHex}`
}
