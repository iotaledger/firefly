import { IRouterEvent } from '@core/router'
import type { Filter } from '@core/utils/types'
import { FilterType } from '..'
import { FilterAction } from '../../contexts/dashboard/enums'

export interface IFilterRouterEvent extends IRouterEvent {
    filter?: Filter
    filterType?: FilterType
    action?: FilterAction
}
