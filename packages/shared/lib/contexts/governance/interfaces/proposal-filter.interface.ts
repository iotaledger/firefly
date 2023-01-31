import { OrderFilterUnit, SelectionFilterUnit } from '@core/utils/interfaces/filter/filter-unit.interface'

export interface IProposalFilter {
    phase: SelectionFilterUnit
    type: SelectionFilterUnit
    participated: SelectionFilterUnit
    order: OrderFilterUnit
}
