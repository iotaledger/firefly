<script lang="typescript">
    import { localize } from '@core/i18n'

    export let tabs: string[]
    export let activeTab: string
</script>

<div
    class="relative flex flex-row p-1 gap-1 border border-solid border-gray-300 dark:border-gray-700 rounded-lg"
    style="height: 40px"
>
    {#each tabs as tab}
        <button
            on:click={() => (activeTab = tab)}
            class="w-full text-13 rounded-md {activeTab === tab
                ? 'text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700'
                : 'text-gray-500'}"
            class:active={activeTab === tab}
        >
            {localize(tab)}
        </button>
    {/each}
</div>
