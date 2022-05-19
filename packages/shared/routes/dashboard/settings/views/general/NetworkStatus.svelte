<script lang="typescript">
    import { Checkbox, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { mobile } from 'shared/lib/app'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    let hideNetworkStatistics = $activeProfile?.settings.hideNetworkStatistics

    $: updateProfile('settings.hideNetworkStatistics', hideNetworkStatistics)
</script>

{#if !$mobile}
    <Text type="h4" classes="mb-3">{localize('views.settings.networkStatus.title')}</Text>
{/if}
<Text type="p" secondary classes="mb-5">{localize('views.settings.networkStatus.description')}</Text>
<Checkbox label={localize('actions.hideNetworkStatistics')} bind:checked={hideNetworkStatistics} />
