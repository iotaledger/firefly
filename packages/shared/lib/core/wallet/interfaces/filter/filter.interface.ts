import {
    AssetFilterUnit,
    DateFilterUnit,
    NumberFilterUnit,
    OrderFilterUnit,
    SelectionFilterUnit,
} from './filter-unit.interface'

export type Filter = ActivityFilter | AssetFilter

export interface ActivityFilter {
    amount: NumberFilterUnit
    status: SelectionFilterUnit
    type: SelectionFilterUnit
    direction: SelectionFilterUnit
    internalExternal: SelectionFilterUnit
    asset: AssetFilterUnit
    date: DateFilterUnit
    showRejected: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    showValueless: SelectionFilterUnit
}

export interface AssetFilter {
    verificationStatus: SelectionFilterUnit
    showHidden: SelectionFilterUnit
    order: OrderFilterUnit
}
