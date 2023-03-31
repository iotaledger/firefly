<script lang="typescript">
    import { localize } from '@core/i18n'
    import { Text } from 'shared/components'
    import { networkStatus } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { NetworkStatusHealthText } from 'shared/lib/typings/network'

    $: healthStatusText = $networkStatus.healthText ?? NetworkStatusHealthText.Down
    $: messagesPerSecond = $networkStatus.messagesPerSecond ?? 0
    $: referencedRate = $networkStatus.referencedRate ?? 0
</script>

<div class="flex flex-col">
    <Text type="h4" classes="-mt-4 mb-4 flex w-full justify-center">
        {localize('views.settings.networkStatus.title')}
    </Text>
    {#if $activeProfile.isDeveloperProfile}
        <section class="bg-gray-50 dark:bg-gray-500 dark:bg-opacity-10 rounded-xl">
            <Text type="p" overrideColor classes="text-gray-500">{localize('general.network')}</Text>
            <Text type="p" overrideColor classes=" text-gray-500">
                {$activeProfile.settings.networkConfig.network.name}
            </Text>
        </section>
    {/if}
    <section class="bg-gray-50 dark:bg-gray-500 dark:bg-opacity-10 rounded-xl">
        <Text type="p" overrideColor classes="text-gray-500">
            {localize('views.dashboard.network.status')}
        </Text>
        <Text type="p" overrideColor classes="text-gray-500">
            {localize(`views.dashboard.network.${healthStatusText}`)}
        </Text>
    </section>
    {#if !$activeProfile?.settings.hideNetworkStatistics}
        <section class="bg-gray-50 dark:bg-gray-500 dark:bg-opacity-10 rounded-xl">
            <Text type="p" overrideColor classes="text-gray-500">
                {localize('views.dashboard.network.messagesPerSecond')}
            </Text>
            <Text type="p" overrideColor classes="text-gray-500">
                {`${Math.round(messagesPerSecond)}`}
            </Text>
        </section>
        <section class="bg-gray-50 dark:bg-gray-500 dark:bg-opacity-10 rounded-xl">
            <Text type="p" overrideColor classes="text-gray-500">
                {localize('views.dashboard.network.referencedRate')}
            </Text>
            <Text type="p" overrideColor classes="text-gray-500">
                {`${Math.round(referencedRate)}%`}
            </Text>
        </section>
    {/if}
</div>

<style lang="scss">
    section {
        display: grid;
        grid-template-columns: 2fr;
        grid-auto-flow: column;
        padding: 1rem 1.25rem;
        margin: 0.3rem 0;
    }
</style>
