<script lang="typescript">
    import { Icon, Text } from 'shared/components'
    import { BottomNavigationTab, walletRoute } from '@core/router'

    export let tab: BottomNavigationTab = undefined

    const handleClick = (): void => {
        tab?.onClick()
    }
</script>

<button
    class="flex flex-col justify-center items-center h-12 w-10 {$walletRoute === tab?.route
        ? 'text-blue-500'
        : 'text-gray-500'}"
    on:click={handleClick}
>
    <Icon width="24" height="24" icon={tab?.icon} />
    <Text
        type="p"
        fontWeight="semibold"
        overrideColor
        color={$walletRoute === tab?.route ? 'text-blue-500' : 'text-gray-500'}
    >
        {tab?.label}
    </Text>
</button>
