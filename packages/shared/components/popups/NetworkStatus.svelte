<script lang="typescript">
    import { Text, Button } from 'shared/components'
    import { activeProfile } from 'shared/lib/profile'
    import { closePopup } from 'shared/lib/popup'
    import { localize } from '@core/i18n'

    export let healthStatusText = 'networkOperational'
    export let healthStatusColor = 'green'
    export let messagesPerSecond = 0
    export let referencedRate = 0
</script>

<div class="flex flex-col">
    {#if $activeProfile.isDeveloperProfile}
        <Text type="h3" classes="px-7 pt-5">{localize('general.network')}</Text>
        <Text type="p" highlighted classes="px-7">{$activeProfile.settings.networkConfig.network.name}</Text>
    {/if}
    <Text type="h3" classes="px-7 pt-{$activeProfile.isDeveloperProfile ? '2' : '5'}"
        >{localize('views.dashboard.network.status')}</Text
    >
    <div class="px-7 pb-5 text-13 text-{healthStatusColor}-500">
        {localize(`views.dashboard.network.${healthStatusText}`)}
    </div>
    {#if !$activeProfile?.settings.hideNetworkStatistics}
        <div class="flex flex-row justify-between px-7 pt-5 pb-2">
            <span class="text-12 text-gray-800 dark:text-white"
                >{localize('views.dashboard.network.messagesPerSecond')}</span
            >
            <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
        </div>
        <div class="flex flex-row justify-between px-7 pb-5">
            <span class="text-12 text-gray-800 dark:text-white"
                >{localize('views.dashboard.network.referencedRate')}</span
            >
            <span class="text-12 text-gray-500">{`${Math.round(referencedRate)}%`}</span>
        </div>
    {/if}
    <Button secondary classes="w-full" onClick={closePopup}>{localize('actions.cancel')}</Button>
</div>
