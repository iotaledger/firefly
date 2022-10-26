<script lang="typescript">
    import { localize } from '@core/i18n'

    export let tabs: string[]
    export let activeTab: string
</script>

<div class="tabs relative flex flex-row bg-gray-50 p-1 gap-4">
    {#each tabs as tab}
        <button
            on:click={() => (activeTab = tab)}
            class="w-full border-sm {activeTab === tab ? 'text-blue-500 bg-white' : 'text-gray-600'}"
            class:active={activeTab === tab}
        >
            {localize(tab)}
        </button>
    {/each}
</div>

<style lang="scss">
    .tabs {
        height: 50px;
    }
</style>
