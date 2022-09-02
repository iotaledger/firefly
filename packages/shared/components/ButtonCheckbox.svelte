<script lang="typescript">
    import { Checkbox, Icon, Text } from 'shared/components'
    import { onMount } from 'svelte'
    import { mobile } from '@lib/app'

    export let icon
    export let value
    export let autofocus = false
    export let round = false

    let buttonElement

    onMount(() => {
        if (autofocus) {
            buttonElement.focus()
        }
    })
</script>

<button
    on:click={() => (value = !value)}
    bind:this={buttonElement}
    type="button"
    class="w-full h-auto flex flex-row p-4 pt-10 pb-10 mb-4 rounded-xl border border-solid items-center space-x-4 border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
    style="height: 72px"
>
    <Checkbox bind:checked={value} {round} classes="ml-1 mr-1 pointer-events-none" tabindex={-1} />
    <Text smaller={!$mobile} classes="mr-3 flex-grow">
        <slot />
    </Text>
    <Icon {icon} classes="text-blue-500" />
</button>
