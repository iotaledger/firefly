<script lang="ts">
    import { Icon, Text, TextType } from '@ui'
    import { Router } from '@core/router'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { DrawerRoute } from '@desktop/routers'

    export let title: string
    export let drawerRouter: Router<DrawerRoute>

    $: showBackButton = drawerRouter?.hasHistory()

    function onBackClick(): void {
        if (drawerRouter) {
            drawerRouter.previous()
        }
    }
</script>

<drawe-template class="flex flex-col h-full space-y-6">
    <drawer-header class="flex flex-row items-center gap-2">
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
    </drawer-header>
    <drawer-body class="flex-grow">
        <slot />
    </drawer-body>
</drawe-template>
