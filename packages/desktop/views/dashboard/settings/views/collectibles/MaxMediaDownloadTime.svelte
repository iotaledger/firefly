<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { TextType } from '@ui/enums'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import type { IDropdownChoice } from '@core/utils'
    import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS } from '@core/nfts'

    function updateMediaDownloadTimeLimit(option): void {
        const maxMediaDownloadTimeInSeconds = option.value

        updateActiveProfileSettings({ maxMediaDownloadTimeInSeconds })
    }

    function assignMaxMediaDownloadTimeOptionLabel(amount: number): string {
        return amount ? amount + ' min' : 'None'
    }

    function maxSizeOptions(): IDropdownChoice[] {
        return [30, 60, 90, 120, 150, 180].map((amount) => ({
            value: amount,
            label: amount + ' min',
        }))
    }
</script>

<Text type={TextType.h4} classes="mb-3">
    {localize('views.settings.maxMediaDownloadTime.title')}
</Text>
<Text secondary classes="mb-5">
    {localize('views.settings.maxMediaDownloadTime.description')}
</Text>
<Dropdown
    onSelect={updateMediaDownloadTimeLimit}
    value={assignMaxMediaDownloadTimeOptionLabel(
        $activeProfile?.settings.maxMediaDownloadTimeInSeconds || DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS
    )}
    items={maxSizeOptions()}
/>
