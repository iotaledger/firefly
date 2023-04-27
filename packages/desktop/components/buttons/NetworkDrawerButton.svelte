<script lang="ts">
    import { FontWeight, Text, NetworkIcon } from '@ui'
    import { DrawerId, closeDrawer, drawerState, openDrawer } from '@desktop/auxilary/drawer'
    import { activeProfile } from '@core/profile/stores'

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
    <NetworkIcon height={16} width={16} networkId={$activeProfile.network.id} outlined={false} />
    <Text fontWeight={FontWeight.semibold} color="gray-800" darkColor="white">{$activeProfile.network.name}</Text>
</button>

<style type="text/scss">
    .network-button {
        @apply flex items-center border border-solid rounded-md text-14;
        @apply pl-2 pr-3 py-1 gap-2;
        -webkit-app-region: none;
    }
</style>
