import { IBaseToken, IPersistedAsset } from '@core/wallet/interfaces'
import { TokenStandard, VerifiedStatus } from '@core/wallet/enums'

export const MANA_ID = 'mana'

export const DEFAULT_MANA: IBaseToken = {
    standard: TokenStandard.BaseToken,
    name: 'Mana',
    tickerSymbol: 'Mana',
    unit: 'Mana',
    decimals: 6,
    subunit: 'µmana',
    useMetricPrefix: false,
}

export const PERSISTED_MANA_ASSET: IPersistedAsset = {
    id: MANA_ID,
    standard: TokenStandard.Mana,
    metadata: DEFAULT_MANA,
    hidden: false,
    verification: { verified: true, status: VerifiedStatus.Official },
}
