import { AssetOrderOption, BooleanFilterOption, OrderOption } from '@core/utils/enums/filters'
import { NotVerifiedStatus, VerifiedStatus } from '../enums'
import { AssetFilter } from '../interfaces'

export const DEFAULT_ASSET_FILTER: AssetFilter = {
    verificationStatus: {
        active: false,
        type: 'selection',
        localeKey: 'filters.verificationStatus',
        selected: 'new',
        choices: Object.values(NotVerifiedStatus)
            .map((status) => String(status))
            .concat(Object.values(VerifiedStatus).map((status) => String(status))),
    },
    network: {
        active: false,
        type: 'network',
        localeKey: 'filters.asset',
        selected: '',
    },
    showHidden: {
        active: false,
        type: 'selection',
        localeKey: 'filters.showHidden',
        selected: BooleanFilterOption.Yes,
        choices: [BooleanFilterOption.Yes, BooleanFilterOption.No],
    },
    order: {
        active: false,
        type: 'order',
        localeKey: 'filters.assetOrder',
        selected: AssetOrderOption.Name,
        ascDesc: OrderOption.Asc,
        choices: [AssetOrderOption.Name, AssetOrderOption.Amount],
    },
}
