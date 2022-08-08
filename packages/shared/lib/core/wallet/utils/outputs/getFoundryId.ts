import { OUTPUT_TYPE_FOUNDRY } from '@core/wallet/constants'
import { ALIAS_ADDRESS_TYPE, IFoundryOutput } from '@iota/iota.js-stardust'
import { HexHelper, WriteStream } from '@iota/util.js-stardust'

export function buildFoundryId(foundry: IFoundryOutput): string {
    if (foundry.type === OUTPUT_TYPE_FOUNDRY) {
        const immutableAliasUnlockCondition = foundry.unlockConditions[0]
        const aliasId =
            immutableAliasUnlockCondition.type === 6 &&
            immutableAliasUnlockCondition.address.type === ALIAS_ADDRESS_TYPE
                ? immutableAliasUnlockCondition.address.aliasId
                : ''
        const typeWS = new WriteStream()
        typeWS.writeUInt8('alias address type', ALIAS_ADDRESS_TYPE)
        const aliasAddress = HexHelper.addPrefix(`${typeWS.finalHex()}${HexHelper.stripPrefix(aliasId)}`)
        const serialNumberWS = new WriteStream()
        serialNumberWS.writeUInt32('serialNumber', foundry.serialNumber)
        const serialNumberHex = serialNumberWS.finalHex()
        const tokenSchemeTypeWS = new WriteStream()
        tokenSchemeTypeWS.writeUInt8('tokenSchemeType', foundry.tokenScheme.type)
        const tokenSchemeTypeHex = tokenSchemeTypeWS.finalHex()

        return `${aliasAddress}${serialNumberHex}${tokenSchemeTypeHex}`
    }
}
