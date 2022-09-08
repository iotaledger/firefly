<script lang="typescript">
    import type { FilterUnit } from '@core/wallet/interfaces'
    import { NumberInput, Checkbox, Dropdown, Icon, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import type { DropdownChoice } from '@core/utils'
    import { visibleSelectedAccountAssets, NumberFilterOption } from '@core/wallet'

    export let filterUnit: FilterUnit
    export let last: boolean = false

    let choices: DropdownChoice[]
    if (filterUnit.type === 'selection' || filterUnit.type === 'number') {
        choices = filterUnit.choices.map((choice) => ({
            label: localize(`${filterUnit.localeKey}.${choice}`),
            value: choice,
        }))
    } else if (filterUnit.type === 'asset') {
        choices = [$visibleSelectedAccountAssets.baseCoin, ...$visibleSelectedAccountAssets.nativeTokens].map(
            (choice) => ({
                label: choice.metadata.name,
                value: choice.metadata.name,
            })
        )

        if (!filterUnit.selected) {
            filterUnit.selected = $visibleSelectedAccountAssets.baseCoin.id
        }
    }

    let value: string
    $: if (filterUnit.type === 'selection' || filterUnit.type === 'number') {
        value = localize(`${filterUnit.localeKey}.${filterUnit.selected}`)
    } else if (filterUnit.type === 'asset') {
        const assetId = filterUnit.selected
        if (assetId === $visibleSelectedAccountAssets.baseCoin.id) {
            value = $visibleSelectedAccountAssets.baseCoin?.metadata.name
        } else {
            value = $visibleSelectedAccountAssets.nativeTokens.find((_nativeToken) => _nativeToken.id === assetId)
                ?.metadata.name
        }
    }

    function updateSubUnitForNumberFilter(): void {
        if (filterUnit.type === 'number') {
            if (
                filterUnit.selected === NumberFilterOption.Equal ||
                filterUnit.selected === NumberFilterOption.Greater ||
                filterUnit.selected === NumberFilterOption.Less
            ) {
                filterUnit.subunit = {
                    type: 'single',
                    amount: '',
                }
            } else if (filterUnit.selected === NumberFilterOption.Range) {
                filterUnit.subunit = {
                    type: 'range',
                    start: '',
                    end: '',
                }
            }
        }
    }

    function onSelect(item): void {
        if (filterUnit.type === 'selection' || filterUnit.type === 'number') {
            filterUnit.selected = item.value
            updateSubUnitForNumberFilter()
        } else if (filterUnit.type === 'asset') {
            let asset = undefined
            if (item.value === $visibleSelectedAccountAssets.baseCoin.metadata.name) {
                asset = $visibleSelectedAccountAssets.baseCoin
            } else {
                asset = $visibleSelectedAccountAssets.nativeTokens.find(
                    (_nativeToken) => _nativeToken.metadata.name === item.value
                )
            }
            filterUnit.selected = asset?.id || ''
        }
    }
</script>

<div
    class="
        filter-item border-t border-solid border-gray-200 dark:border-gray-800 
        {last ? 'rounded-b-xl' : ''}
    "
>
    <div class="px-4 py-3">
        <Checkbox
            label={localize(filterUnit.localeKey + '.label')}
            bind:checked={filterUnit.active}
            small
            keepSameColor
        />
    </div>

    {#if filterUnit.active}
        <div class="bg-gray-50 px-4 py-3 dark:bg-transparent {last ? 'rounded-b-xl' : ''}">
            <Dropdown {value} items={choices} {onSelect} small />

            {#if filterUnit.type === 'number' && filterUnit.selected}
                <div class="flex flex-row items-center space-x-2 mt-2">
                    <Icon height="24" width="20" icon="arrow-right" />
                    {#if filterUnit.subunit.type === 'range'}
                        <NumberInput bind:value={filterUnit.subunit.start} autofocus placeholder="" />
                        <Text>{localize('general.and')}</Text>
                        <NumberInput bind:value={filterUnit.subunit.end} placeholder="" />
                    {:else}
                        <NumberInput bind:value={filterUnit.subunit.amount} autofocus placeholder="" />
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .filter-item {
        :global(box) {
            padding: 0.5rem !important;
        }
    }
</style>
