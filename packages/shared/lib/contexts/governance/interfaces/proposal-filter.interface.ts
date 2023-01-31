import { OrderFilterUnit, SelectionFilterUnit } from '@core/utils/interfaces/filter/filter-unit.interface'

export interface ProposalFilter {
    phase: SelectionFilterUnit
    type: SelectionFilterUnit
    participated: SelectionFilterUnit
    order: OrderFilterUnit
}
