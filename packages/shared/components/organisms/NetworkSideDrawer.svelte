<script lang="ts">
    import { localize } from '@core/i18n'
    import { SideDrawer, Text, TextType, Icon } from 'shared/components/'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { sideDrawerState } from '@auxiliary/side-drawer/stores'
    import { closeSideDrawer } from '@auxiliary/side-drawer/actions'
</script>

{#if $sideDrawerState.active}
    <SideDrawer onClose={closeSideDrawer}>
        <div class="flex flex-row justify-between mb-6">
            <div class="flex justify-center content-center">
                <Text type={TextType.h4} classes="text-center">{localize('views.dashboard.network.drawer.title')}</Text>
            </div>
            <button type="button" on:click={closeSideDrawer}>
                <Icon width="24" height="24" icon={IconEnum.Close} classes="text-gray-500" />
            </button>
        </div>
    </SideDrawer>
{/if}
