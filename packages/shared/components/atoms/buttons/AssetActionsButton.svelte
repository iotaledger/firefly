<script lang="typescript">
    import { IAsset } from '@core/wallet'
    import { Modal, AssetActionsMenu } from 'shared/components'

    export let classes = ''
    export let asset: IAsset

    let modal: Modal
</script>

<div class="max-h-7 max-w-9 flex-none flex-initial overflow-visible">
    <button
        on:click={modal?.toggle}
        class="px-2 py-3 flex flex-row space-x-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white dark:bg-opacity-50 rounded-lg {classes}"
    >
        {#each Array(3) as _}
            <svg width="4" height="4" viewBox="0 0 4 4">
                <circle cx="2" cy="2" r="2" class="fill-current" />
            </svg>
        {/each}
    </button>
    <AssetActionsMenu bind:modal {asset} />
</div>
