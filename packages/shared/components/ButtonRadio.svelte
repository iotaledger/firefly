<script lang="typescript">
    import { Icon, Radio, Text } from 'shared/components'
    import { onMount } from 'svelte'
    import { mobile } from '@lib/app'

    export let icon
    export let value
    export let group
    export let autofocus = false

    let buttonElement

    onMount(() => {
        if (autofocus) {
            buttonElement.focus()
        }
    })
</script>

<button
    on:click={() => (group = value)}
    bind:this={buttonElement}
    type="button"
    class="w-full flex flex-row p-4 mb-4 rounded-2xl border border-solid items-center justify-between border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-700 focus:border-gray-500 dark:focus:border-gray-700"
    style="height: 72px"
>
    <div class="flex flex-row items-center">
        <Icon {icon} classes="text-blue-500" />
        <Text smaller={!$mobile} classes="ml-3">
            <slot />
        </Text>
    </div>
    <Radio {value} bind:group classes="mb-0" tabindex={-1} />
</button>
