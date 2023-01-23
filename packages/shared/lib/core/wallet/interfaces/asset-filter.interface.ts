import { OrderFilterUnit, SelectionFilterUnit } from '@core/utils/interfaces/filter'

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    order: OrderFilterUnit
}
