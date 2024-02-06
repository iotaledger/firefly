import {
    MILLISECONDS_PER_DAY,
    MILLISECONDS_PER_HOUR,
    MILLISECONDS_PER_MINUTE,
    MILLISECONDS_PER_WEEK,
} from 'shared/lib/core/utils'
import { TimeUnit } from '../enums'

export const TIME_UNIT_MS_MAP: Record<TimeUnit, number> = {
    [TimeUnit.Weeks]: MILLISECONDS_PER_WEEK,
    [TimeUnit.Days]: MILLISECONDS_PER_DAY,
    [TimeUnit.Hours]: MILLISECONDS_PER_HOUR,
    [TimeUnit.Minutes]: MILLISECONDS_PER_MINUTE,
}
