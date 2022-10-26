import { IotaUnit } from '../enums'
import { IotaUnitMap } from '../types'

export const IOTA_UNIT_MAP: IotaUnitMap = {
    [IotaUnit._]: { value: 1, decimalPlaces: 0 },
    [IotaUnit.K]: { value: 1000, decimalPlaces: 3 },
    [IotaUnit.M]: { value: 1000000, decimalPlaces: 6 },
    [IotaUnit.G]: { value: 1000000000, decimalPlaces: 9 },
    [IotaUnit.T]: { value: 1000000000000, decimalPlaces: 12 },
    [IotaUnit.P]: { value: 1000000000000000, decimalPlaces: 15 },
}
