<script lang="typescript">
    import { Icon, Modal, NetworkSummaryModal } from 'shared/components'
    import { getAndUpdateNodeInfo, networkStatus, NETWORK_HEALTH_COLORS } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let modal: Modal = undefined

    $: healthStatus = $networkStatus.health ?? 0

    // TODO: Move this to dashboard or onload logic
    // $: healthStatus !== 2 && showNetworkIssuesNotification()

    function onClick() {
        modal?.open()
        getAndUpdateNodeInfo()
    }
</script>

<div class="flex flex-col items-center relative">
    <button on:click={onClick}>
        <Icon width="48" height="48" icon={$activeProfile?.networkProtocol} classes="dark:text-white" />
    </button>
    {#if healthStatus !== 2}
        <div class="absolute -bottom-7" on:mouseenter={onClick} on:mouseleave={modal?.close}>
            <Icon width="18" icon="warning-filled" classes="text-{NETWORK_HEALTH_COLORS[healthStatus]}-500" />
        </div>
    {/if}
</div>
<NetworkSummaryModal bind:modal />
