import { OrderFilterUnit, SelectionFilterUnit } from '@core/utils/interfaces/filter/filter-unit.interface'

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    order: OrderFilterUnit
}
