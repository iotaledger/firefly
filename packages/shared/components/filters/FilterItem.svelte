<script lang="typescript">
    import { Filter } from '@core/wallet/interfaces/filter.interface'
    import { Checkbox } from 'shared/components'
    import { localize } from '@core/i18n'

    export let filterItem: Filter
</script>

<div class="border-t border-solid border-gray-200">
    <div class="px-4 py-3">
        <Checkbox label={localize(filterItem.label)} bind:checked={filterItem.active} small keepSameColor />
    </div>
</div>
