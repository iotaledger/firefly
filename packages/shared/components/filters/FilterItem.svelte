<script lang="typescript">
    import { FilterUnit } from '@core/wallet/interfaces/filter.interface'
    import { Checkbox } from 'shared/components'
    import { localize } from '@core/i18n'

    export let filterUnit: FilterUnit
</script>

<div class="border-t border-solid border-gray-200 dark:border-gray-800">
    <div class="px-4 py-3">
        <Checkbox label={localize(filterUnit.label)} bind:checked={filterUnit.active} small keepSameColor />
    </div>
</div>
