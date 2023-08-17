<script lang="ts">
    import { localize } from '@core/i18n'

    export let tabs: string[]
    export let activeTab: string
</script>

<tabs-container
    class="relative flex flex-row p-1 gap-1 border border-solid border-gray-300 dark:border-gray-700 rounded-lg h-10"
>
    {#each tabs as tab}
        <button on:click={() => (activeTab = tab)} class:active={activeTab === tab}>
            {localize(tab)}
        </button>
    {/each}
</tabs-container>

<style lang="scss">
    button {
        @apply w-full;
        @apply text-13;
        @apply rounded-md;
        @apply text-gray-500;
        &.active {
            @apply text-gray-800 dark:text-white;
            @apply bg-gray-100 dark:bg-gray-700;
        }
    }
</style>
