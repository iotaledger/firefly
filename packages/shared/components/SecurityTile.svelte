<script lang="typescript">
    import { Icon, Text, Toggle } from 'shared/components'

    export let icon = 'shield'
    export let title = ''
    export let message = ''
    export let color = 'blue'
    export let classes = ''
    export let toggle = false
    export let wide = false
    export let toggleActive = undefined
    export let warning = false
    export let disabled = false
    export let keepDarkThemeIconColor = false
    export let refreshIcon = false
    export let loading = false
    export let onClick = () => {}
</script>

<style type="text/scss">
    button {
        &:not(.wide) {
            min-height: 120px;
        }
        &:disabled {
            @apply opacity-50;
            @apply pointer-events-none;
        }
    }
</style>

<button
    on:click={() => onClick()}
    class="relative flex {wide ? 'flex-row items-center space-x-4' : 'flex-col flex-wrap '} justify-between text-left rounded-xl {wide ? 'bg-gray-100 p-4' : `bg-${color}-50 px-4 pt-4 pb-5`} dark:bg-gray-900 dark:bg-opacity-50 {classes}"
    class:wide
    {disabled}>
    <div class="h-full {wide ? 'flex flex-row items-center space-x-4' : 'flex flex-col justify-between flex-auto'} flex-nowrap">
        <Icon
            boxed
            {icon}
            classes="text-white"
            boxClasses="{toggle ? 'bg-gray-400' : `bg-${color}-500`}  {!keepDarkThemeIconColor && 'dark:bg-gray-900'}" />
        <div>
            <Text smaller bold>{title}</Text>
            <p class="text-10 leading-120 text-gray-500 {wide ? 'mt-1' : 'mt-1.5'}">{message}</p>
        </div>
    </div>
    {#if toggle}
        <Toggle active={toggleActive} {color} />
    {:else if !toggle && warning}
        <Icon icon="warning-filled" classes="absolute right-4 top-5 {color ? `text-${color}-500` : 'text-yellow-500'}" />
    {:else if refreshIcon}
        <Icon icon="refresh" classes="{loading && 'animate-spin-reverse'} text-gray-500 dark:text-white" />
    {/if}
</button>
