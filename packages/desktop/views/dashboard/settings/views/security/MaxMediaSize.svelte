<script lang="typescript">
    import { Dropdown, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'
    import type { IDropdownChoice } from '@core/utils'

    function updateMediaSizeLimit(option): void {
        updateActiveProfileSettings({ maxMediaSizeInMegaBytes: option.value })
    }

    function assignMaxMediaSizeOptionLabel(amount: number): string {
        return amount ? amount + ' MB' : 'None'
    }

    function maxSizeOptions(): IDropdownChoice[] {
        return [5, 10, 25, 50, 100, undefined].map((amount) => ({
            value: amount,
            label: amount ? amount + ' MB' : 'None',
        }))
    }
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.maxMediaSize.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.maxMediaSize.description')}</Text>
<Dropdown
    onSelect={updateMediaSizeLimit}
    value={assignMaxMediaSizeOptionLabel($activeProfile?.settings.maxMediaSizeInMegaBytes)}
    items={maxSizeOptions()}
/>
