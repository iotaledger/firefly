<script lang="typescript">
    import { Checkbox, Icon, Text } from 'shared/components'
    import { onMount } from 'svelte'

    export let icon
    export let value
    export let autofocus = false

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
    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-1 border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 focus:hover:border-gray-700"
    style="height: 72px">
    <Icon {icon} classes="text-blue-500" />
    <div class="flex flex-row items-center">
        <Text smaller>
            <slot />
        </Text>
    </div>
    <Checkbox bind:checked={value} classes="mb-0 pointer-events-none" tabindex={-1} />
</button>
