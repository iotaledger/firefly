<script lang="ts">
    import { IAsset, visibleSelectedAccountAssets } from '@core/wallet'
    import { AssetTile, Icon, Text, AssetIcon, FontWeight } from 'shared/components'
    import { clickOutside } from '@core/utils'
    import { activeProfile } from '@core/profile'

    export let asset = $visibleSelectedAccountAssets?.[$activeProfile?.network?.id]?.baseCoin
    export let readonly: boolean = false

    let isDropdownOpen = false
    let assetList: IAsset[] = []

    $: isReadonly = readonly || $visibleSelectedAccountAssets?.[$activeProfile?.network?.id]?.nativeTokens.length === 0
    $: $visibleSelectedAccountAssets, (assetList = getAssetList())

    function getAssetList(): IAsset[] {
        const list = []
        for (const assetsPernetwork of Object.values($visibleSelectedAccountAssets)) {
            if (assetsPernetwork?.baseCoin) {
                list.push(assetsPernetwork.baseCoin)
            }
            list.push(...(assetsPernetwork?.nativeTokens ?? []))
        }
        return list
    }

    function onDropdownClick(): void {
        if (!isReadonly) {
            isDropdownOpen = !isDropdownOpen
        }
    }

    function onAssetClick(_asset: IAsset): void {
        asset = _asset
        isDropdownOpen = false
    }

    function onOutsideClick(): void {
        isDropdownOpen = false
    }
</script>

{#if asset}
    <div class="flex flex-col" use:clickOutside on:clickOutside={onOutsideClick}>
        <button
            type="button"
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
            class:cursor-pointer={!isReadonly}
            on:click={onDropdownClick}
        >
            <AssetIcon small {asset} />
            <div class="w-full relative" style="max-width: 75px;">
                <Text
                    color="gray-600"
                    darkColor="white"
                    fontWeight={FontWeight.semibold}
                    fontSize="15"
                    classes="overflow-hidden whitespace-nowrap text-ellipsis"
                >
                    {asset?.metadata?.name ?? asset?.id}
                </Text>
            </div>
            {#if !isReadonly}
                <div class="transform rotate-0">
                    <Icon height="18" width="18" icon="chevron-down" classes="text-gray-600 dark:text-gray-500" />
                </div>
            {/if}
        </button>
        {#if isDropdownOpen && !isReadonly}
            <div
                class="dropdown bg-white dark:bg-gray-800 absolute flex flex-col top-12 -left-5 -right-5 border border-solid border-blue-500 rounded-xl z-10 p-4 max-h-96"
            >
                <ul class="overflow-y-auto h-full -mr-2 pr-2">
                    {#each assetList as asset}
                        <li>
                            <AssetTile
                                onClick={() => onAssetClick(asset)}
                                {asset}
                                classes="bg-white hover:bg-gray-50 dark:bg-transparent"
                            />
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    /* odd margin needed to match the size of the upper parent box */
    .dropdown {
        margin: 0 3px;
    }
</style>
