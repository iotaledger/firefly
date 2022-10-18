import { get } from 'svelte/store'
import { AssetOrderOption, OrderOption } from '../enums'
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
    return asset1.metadata.name.toLowerCase() > asset2.metadata.name.toLowerCase() ? (asc ? 1 : -1) : asc ? -1 : 1
}

function sortByAmount(asset1: IAsset, asset2: IAsset, asc: boolean): number {
    return asset1.balance.total > asset2.balance.total ? (asc ? 1 : -1) : asc ? -1 : 1
}
