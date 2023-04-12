<script lang="ts">
    import { localize } from '@core/i18n'
    import { isNetworkSideDrawerOpen } from '@core/network/stores'
    import { SideDrawer, Text, TextType, Icon } from 'shared/components/'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    function closeDrawer(): void {
        $isNetworkSideDrawerOpen = false
    }
</script>

{#if $isNetworkSideDrawerOpen}
    <SideDrawer onClose={closeDrawer}>
        <div class="flex flex-row justify-between mb-6">
            <div class="flex justify-center content-center">
                <Text type={TextType.h4} classes="text-center">{localize('views.dashboard.network.drawer.title')}</Text>
            </div>
            <button type="button" on:click={closeDrawer}>
                <Icon width="24" height="24" icon={IconEnum.Close} classes="text-gray-500" />
            </button>
        </div>
    </SideDrawer>
{/if}
