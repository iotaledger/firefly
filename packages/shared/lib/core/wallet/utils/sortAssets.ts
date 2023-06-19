import { AssetOrderOption, OrderOption } from '@core/utils/enums/filters'
import { get } from 'svelte/store'
import { IAsset } from '../interfaces'
import { assetFilter } from '../stores'

export function sortAssets(assets: IAsset[]): IAsset[] {
    const filter = get(assetFilter)
    let orderFunction = sortByName
    let isAscending = true

    if (filter.order.active) {
        switch (filter.order.selected) {
            case AssetOrderOption.Name:
                orderFunction = sortByName
                break
            case AssetOrderOption.Amount:
                orderFunction = sortByAmount
                break
        }
        isAscending = filter.order.ascDesc === OrderOption.Asc
    }

    return assets?.sort((asset1, asset2) => orderFunction(asset1, asset2, isAscending)) ?? []
}

function sortByName(asset1: IAsset, asset2: IAsset, asc: boolean): number {
    const name1 = asset1?.metadata?.name
    const name2 = asset2?.metadata?.name
    if (!name1) {
        return asc ? 1 : -1
    } else if (!name2) {
        return asc ? -1 : 1
    }

    return name1.toLowerCase() > name2.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByAmount(asset1: IAsset, asset2: IAsset, asc: boolean): number {
    return asset1.balance.total > asset2.balance.total ? (asc ? 1 : -1) : asc ? -1 : 1
}
