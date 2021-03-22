<script lang="typescript">
    import { Icon, Text, Toggle } from 'shared/components'

    export let icon = 'shield'
    export let title = ''
    export let message = ''
    export let color = 'blue'
    export let classes = ''
    export let toggle = false
    export let toggleActive = undefined
    export let warning = false
    export let onClick = () => {}
</script>

<style type="text/scss">
    button:not(.toggle) {
        min-height: 125px;
    }
</style>

<button
    on:click={() => onClick()}
    class="relative flex {toggle ? 'flex-row items-center space-x-4' : 'flex-col flex-wrap '} justify-between text-left rounded-xl {toggle ? 'bg-gray-50 p-4' : `bg-${color}-50 px-4 pt-4 pb-5`} dark:bg-gray-900 dark:bg-opacity-50 {classes}"
    class:toggle>
    <div class="h-full {toggle ? 'flex flex-row items-center space-x-4' : 'flex flex-col justify-between'} flex-nowrap">
        <Icon boxed {icon} classes="text-white" boxClasses="{toggle ? 'bg-gray-400' : `mb-2 bg-${color}-500`} dark:bg-gray-900" />
        <div>
            <Text smaller bold>{title}</Text>
            <p class="text-10 leading-120 text-gray-500 {toggle ? 'mt-1' : 'mt-1.5'}">{message}</p>
        </div>
    </div>
    {#if toggle}
        <Toggle active={toggleActive} {color} />
    {/if}
    {#if !toggle && warning}
        <Icon icon="warning-filled" classes="absolute right-4 top-5 {color ? `text-${color}-500` : 'text-yellow-500'}" />
    {/if}
</button>
