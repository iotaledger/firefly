<script lang="ts">
    import { Icon, NumberInput, Radio, Text } from '@ui'

    import { localize } from '@core/i18n'
    import type { IDropdownChoice } from '@core/utils'
    import { NumberFilterOption } from '@core/utils/enums/filters'
    import { NumberFilterUnit } from '@core/utils/interfaces/filter'

    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let filterUnit: NumberFilterUnit

    const choices: IDropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    let selectedFilterUnit: NumberFilterOption = filterUnit.selected
    $: selectedFilterUnit, updateFilterUnit()

    function updateFilterUnit(): void {
        const updated = filterUnit.selected !== selectedFilterUnit
        filterUnit.selected = selectedFilterUnit

        if (updated) {
            switch (filterUnit.selected) {
                case NumberFilterOption.Equal:
                case NumberFilterOption.Greater:
                case NumberFilterOption.Less:
                    filterUnit.subunit = {
                        type: 'single',
                        amount: '',
                    }
                    break
                case NumberFilterOption.Range:
                    filterUnit.subunit = {
                        type: 'range',
                        start: '',
                        end: '',
                    }
                    break
            }
        }
    }
</script>

<number-filter-options class="flex flex-col overflow-y-auto">
    {#each choices as choice}
        <Radio value={choice.value} bind:group={selectedFilterUnit} label={choice.label} />
    {/each}
</number-filter-options>

{#if filterUnit.selected}
    <div class="flex flex-row items-center space-x-2 mt-2">
        <Icon height="24" width="20" icon={IconEnum.ArrowRight} />
        {#if filterUnit.subunit.type === 'range'}
            <NumberInput bind:value={filterUnit.subunit.start} autofocus placeholder="" />
            <Text>{localize('general.and')}</Text>
            <NumberInput bind:value={filterUnit.subunit.end} placeholder="" />
        {:else}
            <NumberInput bind:value={filterUnit.subunit.amount} autofocus placeholder="" />
        {/if}
    </div>
{/if}
