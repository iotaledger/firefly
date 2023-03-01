<script lang="ts">
    import { HR, Radio } from '@ui'

    import { localize } from '@core/i18n'
    import type { IDropdownChoice } from '@core/utils'
    import { OrderOption } from '@core/utils/enums/filters'
    import { OrderFilterUnit } from '@core/utils/interfaces/filter'

    export let filterUnit: OrderFilterUnit

    const choices: IDropdownChoice[] = filterUnit.choices.map((choice) => ({
        label: localize(`${filterUnit.localeKey}.${choice}`),
        value: choice,
    }))

    const ascDescChoices: IDropdownChoice[] = [OrderOption.Asc, OrderOption.Desc].map((choice) => ({
        label: localize(`filters.ascDesc.${choice}`),
        value: choice,
    }))
</script>

<order-filter-item class="flex flex-col justify-between space-y-2">
    <div>
        {#each choices as choice}
            <Radio value={choice.value} bind:group={filterUnit.selected} label={choice.label} />
        {/each}
    </div>
    <HR />
    <div>
        {#each ascDescChoices as choice}
            <Radio value={choice.value} bind:group={filterUnit.ascDesc} label={choice.label} />
        {/each}
    </div>
</order-filter-item>
