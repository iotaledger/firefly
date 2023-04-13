<script lang="ts">
    import { Dropdown, Text } from '@ui'
    import { TextType } from '@ui/enums'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile/stores'
    import { DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS } from '@core/nfts'
    import { IDropdownItem } from '@core/utils'

    function onMaxMediaDownloadTimeChange(option: IDropdownItem<number>): void {
        const maxMediaDownloadTimeInSeconds = option.value

        updateActiveProfileSettings({ maxMediaDownloadTimeInSeconds })
    }

    function assignMaxMediaDownloadTimeOptionLabel(amount: number): string {
        return amount ? localize('times.second', { values: { time: amount } }) : localize('general.none')
    }

    const maxSizeOptions: IDropdownItem<number>[] = [30, 60, 90, 120, 150, 180].map((amount) => ({
        value: amount,
        label: assignMaxMediaDownloadTimeOptionLabel(amount),
    }))
</script>

<Text type={TextType.h4} classes="mb-3">
    {localize('views.settings.maxMediaDownloadTime.title')}
</Text>
<Text secondary classes="mb-5">
    {localize('views.settings.maxMediaDownloadTime.description')}
</Text>
<Dropdown
    onSelect={onMaxMediaDownloadTimeChange}
    value={$activeProfile?.settings.maxMediaDownloadTimeInSeconds || DEFAULT_MAX_NFT_DOWNLOADING_TIME_IN_SECONDS}
    items={maxSizeOptions}
/>
