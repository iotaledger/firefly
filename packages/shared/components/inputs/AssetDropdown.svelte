<script lang="typescript">
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { Icon, Text, AssetTile } from 'shared/components'
    import { assets } from '@core/wallet'

    export let asset = $assets?.[0]

    const hasMultipleAssets = $assets.length > 1

    let collapsed = false

    function handleDropdownClick() {
        if (hasMultipleAssets) {
            collapsed = !collapsed
        }
    }

    function handleAssetClick(_asset) {
        asset = _asset
    }
</script>

{#if asset}
    <div on:click={handleDropdownClick} class="flex flex-col relative">
        <div
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
            class:cursor-pointer={hasMultipleAssets}
        >
            <div
                class="icon icon-bg h-6 w-6 rounded-full flex items-center justify-center p-0.5"
                style="--icon-bg-color: {asset?.metadata?.primaryColor}"
            >
                <Icon classes="text-white" icon={asset?.metadata.name.toLocaleLowerCase()} height="100%" width="100%" />
            </div>
            <Text color="gray-600" darkColor="gray-500" fontWeight={FontWeightText.semibold} fontSize="15">
                {asset?.metadata.name}
            </Text>
            {#if hasMultipleAssets}
                <div class="transform rotate-0">
                    <Icon height="18" width="18" icon="chevron-down" classes="text-gray-600 dark:text-gray-500" />
                </div>
            {/if}
        </div>
    </div>
    {#if collapsed && hasMultipleAssets}
        <ul
            class="bg-gray-50 absolute top-12 asset-list-sizing border border-solid border-gray-300 rounded-2xl z-10"
            on:click={handleDropdownClick}
        >
            {#each $assets as _asset}
                <li on:click={() => handleAssetClick(_asset)}>
                    <AssetTile asset={_asset} />
                </li>
            {/each}
        </ul>
    {/if}
{/if}

<style>
    .icon-bg {
        background-color: var(--icon-bg-color);
    }

    .asset-list-sizing {
        left: -1.25rem;
        right: -1.125rem;
    }
</style>
