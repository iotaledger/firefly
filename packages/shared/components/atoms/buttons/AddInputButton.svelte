<script lang="typescript">
    import { Icon, Text } from 'shared/components'

    export let buttonElement: HTMLButtonElement
    export let text: string
    export let open = false
    export let onClick: () => void
    export let onMouseEnter: () => void
    export let onMouseLeave: () => void
</script>

{#if !open}
    <button
        bind:this={buttonElement}
        class="py-1.5 px-3 w-max bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-900 dark:focus:bg-gray-900 text-gray-600 dark:text-gray-500 rounded-md"
        on:click={onClick}
        on:mouseenter={onMouseEnter}
        on:mouseleave={onMouseLeave}
    >
        <div class="flex flex-row items-center space-x-2">
            <Icon icon="plus" height="10" width="10" classes="text-gray-600" />
            <Text fontSize="12" color="gray-600">{text}</Text>
        </div>
    </button>
{/if}
