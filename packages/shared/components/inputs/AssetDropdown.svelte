<script lang="typescript">
    import { assets } from '@core/wallet'
    import { AssetTile, Icon, Text } from 'shared/components'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import { clickOutside } from 'shared/lib/actions'

    export let asset = $assets?.[0]

    let isDropdownOpen = false

    $: hasMultipleAssets = $assets?.length > 1

    function handleDropdownClick() {
        if (hasMultipleAssets) {
            isDropdownOpen = !isDropdownOpen
        }
    }

    function handleAssetClick(_asset) {
        asset = _asset
        isDropdownOpen = false
    }

    function handleOnClickOutside(): void {
        isDropdownOpen = false
    }
</script>

{#if asset}
    <div class="flex flex-col" use:clickOutside on:clickOutside={handleOnClickOutside}>
        <div
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
            class:cursor-pointer={hasMultipleAssets}
            on:click={handleDropdownClick}
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
        {#if isDropdownOpen && hasMultipleAssets}
            <div
                class="dropdown bg-white dark:bg-gray-800 absolute flex flex-col top-12 -left-5 -right-5 border border-solid border-blue-500 rounded-xl z-10 p-4 "
            >
                <ul class="overflow-y-auto h-full space-y-2.5 -mr-2 pr-2 scroll-secondary">
                    {#each $assets as _asset}
                        <li on:click={() => handleAssetClick(_asset)}>
                            <AssetTile
                                asset={_asset}
                                overrideColor
                                classes="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                            />
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style>
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
    /* odd margin needed to match the size of the upper parent box */
    .dropdown {
        margin: 0 3px;
        max-height: 224px;
    }
</style>
