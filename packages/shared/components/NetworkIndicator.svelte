<script lang="typescript">
    import { onDestroy } from 'svelte'
    import { fade } from 'svelte/transition';
    import { Text } from 'shared/components'
    import { networkStatus } from 'shared/lib/networkStatus'
    export let isActive
    export let locale
    let healthStatus = 2
    let healthStatusText = 'network_operational'
    let messagesPerSecond = 0
    let confirmationRate = 0

    const unsubscribe = networkStatus.subscribe((data) => {
        healthStatus = data.health ?? 0
        healthStatusText =
            healthStatus === 0 ? 'network_down' : healthStatus === 1 ? 'network_degraded' : 'network_operational'
        messagesPerSecond = data.itemsPerSecond ?? 0;
        confirmationRate = data.confirmationRate ?? 0;
    })

    onDestroy(() => {
        unsubscribe()
    })
</script>

<style type="text/scss">
    network-indicator-shield {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: transparent;
        z-index: 10;
    }

    network-indicator-content {
        position: absolute;
        min-width: 230px;
        left: 80px;
        bottom: 25px;
        border-radius: 10px;
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);

        .health-status {
            &.health-2 {
                color: var(--green-ff-color);
            }
            &.health-1 {
                color: var(--yellow-ff-color);
            }
            &.health-0 {
                color: var(--red-ff-color);
            }
        }

        hr {
            border-top: 1px solid var(--line-separator-color);
        }
    }
</style>

{#if isActive}
    <network-indicator-shield on:click={() => (isActive = false)} />
    <network-indicator-content class="flex flex-col bg-white dark:bg-gray-900" transition:fade={{}}>
        <Text type="h3" classes="px-7 pt-5">{locale('views.network.status')}</Text>
        <div class={`px-7 pb-5 text-13 health-status health-${healthStatus}`}>{locale(`views.network.${healthStatusText}`)}</div>
        <hr />
        <div class="flex flex-row justify-between px-7 pt-5 pb-2">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.network.messages_per_second')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(messagesPerSecond)}`}</span>
        </div>
        <div class="flex flex-row justify-between px-7 pb-5">
            <span class="text-12 text-gray-800 dark:text-white">{locale('views.network.confirmation_rate')}</span>
            <span class="text-12 text-gray-500">{`${Math.round(confirmationRate)}%`}</span>
        </div>
    </network-indicator-content>
{/if}
