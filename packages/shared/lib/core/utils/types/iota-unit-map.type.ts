import { IotaUnit } from '../enums'

export type IotaUnitMap = {
    [unit in IotaUnit]: {
        value: number
        decimalPlaces: number
    }
}
