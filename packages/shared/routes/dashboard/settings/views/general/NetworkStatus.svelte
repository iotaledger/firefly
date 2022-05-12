<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { activeProfile, updateActiveProfileSettings } from '@core/profile'

    let hideNetworkStatistics = $activeProfile?.settings.hideNetworkStatistics

    $: updateActiveProfileSettings({ hideNetworkStatistics })
</script>

<Text type="h4" classes="mb-3">{localize('views.settings.networkStatus.title')}</Text>
<Text type="p" secondary classes="mb-5">{localize('views.settings.networkStatus.description')}</Text>
<Checkbox label={localize('actions.hideNetworkStatistics')} bind:checked={hideNetworkStatistics} />
