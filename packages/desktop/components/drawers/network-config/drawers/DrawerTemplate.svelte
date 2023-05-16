<script lang="ts">
    import { Icon, Text, TextType } from '@ui'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { closeDrawer, drawerState } from '@desktop/auxilary/drawer'
    import { DrawerRoute } from '@desktop/routers'

    export let title: string
    export let drawerRouter: Router<DrawerRoute>

    $: showBackButton = drawerRouter?.hasHistory()

    function onCloseClick(): void {
        if (!$drawerState.preventClose) {
            closeDrawer()
        }
    }

    function onBackClick(): void {
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

<drawer-header class="flex flex-row items-center mb-6 gap-2">
    {#if showBackButton}
        <button on:click={onBackClick} class=" focus:text-blue-500">
            <Icon
                icon={IconEnum.ArrowLeft}
                classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
            />
        </button>
    {/if}

    <Text type={TextType.h4} classes="text-center">
        {title}
    </Text>

    {#if !$drawerState.hideClose}
        <button on:click={onCloseClick} class="absolute top-7 right-7 focus:text-blue-500">
            <Icon
                icon={IconEnum.Close}
                classes="text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
            />
        </button>
    {/if}
</drawer-header>
<drawer-body>
    <slot />
</drawer-body>
