<script lang="typescript">
    import { Icon, Modal } from 'shared/components'
    import { showAppNotification } from '@lib/notifications'
    import { networkStatus, NETWORK_HEALTH_COLORS } from 'shared/lib/networkStatus'
    import { activeProfile } from 'shared/lib/profile'
    import { localize } from '@core/i18n'

    export let modal: Modal

    $: healthStatus = $networkStatus.health ?? 0
    $: healthStatus !== 2 && showNetworkIssuesNotification()

    function showNetworkIssuesNotification() {
        showAppNotification({
            type: 'warning',
            message: localize('indicators.networkIndicator.warningText', {
                values: { networkName: $activeProfile?.settings?.networkConfig.network.name },
            }),
        })
    }
</script>

<div class="flex flex-col items-center relative">
    <button on:click={modal?.open}>
        <Icon width="48" height="48" icon={$activeProfile?.protocol} classes="dark:text-white" />
    </button>
    {#if healthStatus !== 2}
        <div class="absolute -bottom-7" on:mouseenter={modal?.open} on:mouseleave={modal?.close}>
            <Icon width="18" icon="warning-filled" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
        </div>
    {/if}
</div>
