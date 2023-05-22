<script lang="ts">
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { NetworkHealth, chainStatuses, networkStatus } from '@core/network'
    import { activeProfile } from '@core/profile/stores'
    import { DrawerId, closeDrawer, drawerState, openDrawer } from '@desktop/auxiliary/drawer'
    import { FontWeight, Icon, NetworkIcon, Text } from '@ui'

    $: isAnyChainDisconnected = Object.values($chainStatuses ?? [])?.some(
        ({ health }) => health === NetworkHealth.Disconnected
    )
    $: displayWarning =
        isAnyChainDisconnected ||
        $networkStatus?.health === NetworkHealth.Degraded ||
        $networkStatus?.health === NetworkHealth.Disconnected

    function onNetworkClick(): void {
        if ($drawerState.active) {
            closeDrawer()
        } else {
            openDrawer({ id: DrawerId.NetworkConfig })
        }
    }
</script>

<button
    class="network-button hover:bg-gray-300 dark:hover:bg-gray-900 border-gray-400 dark:border-gray-700"
    on:click={onNetworkClick}
>
    <NetworkIcon height={12} width={12} networkId={$activeProfile.network.id} outlined={false} />
    <Text fontWeight={FontWeight.semibold} color="gray-800" darkColor="white">{$activeProfile.network.name}</Text>
    {#if displayWarning}
        <Icon icon={IconEnum.WarningFilled} classes="text-red-500" height={16} width={16} />
    {/if}
</button>

<style type="text/scss">
    .network-button {
        @apply flex items-center border border-solid rounded-md text-14;
        @apply pl-2 pr-3 py-1 gap-2;
        -webkit-app-region: none;
    }
</style>
