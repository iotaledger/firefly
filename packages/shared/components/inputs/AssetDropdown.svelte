<script lang="typescript">
    import { NetworkProtocol } from '@core/network'
    import { localize } from '@core/i18n'
    import { visibleSelectedAccountAssets } from '@core/wallet'
    import { AssetIcon, AssetTile, Icon, InputContainer, Text, TextInput } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
    import { clickOutside } from 'shared/lib/actions'

    export let asset = $visibleSelectedAccountAssets?.baseCoin
    export let isFocused = false
    export let isDropdownOpen = false
    export let inputElement: HTMLInputElement

    let searchQuery = ''
    let icon: string

    $: hasMultipleAssets = $visibleSelectedAccountAssets?.nativeTokens.length >= 1
    $: switch (asset?.metadata?.name?.toLocaleLowerCase()) {
        case NetworkProtocol.IOTA:
        case NetworkProtocol.Shimmer:
            icon = asset?.metadata?.name?.toLocaleLowerCase()
            break
        default:
            icon = 'tokens'
    }

    function handleDropdownClick() {
        if (hasMultipleAssets) {
            isDropdownOpen = !isDropdownOpen
            isFocused = !isFocused
        }
    }

    function handleAssetClick(_asset) {
        asset = _asset
        isDropdownOpen = false
    }

    function handleOnClickOutside(): void {
        isDropdownOpen = false
        isFocused = false
    }
</script>

{#if asset}
    <div class="asset-dropdown flex flex-col" use:clickOutside on:clickOutside={handleOnClickOutside}>
        <div
            class="flex flex-row items-center p-2 space-x-2 text-left bg-gray-100 dark:bg-gray-700 rounded-md cursor-default"
            class:cursor-pointer={hasMultipleAssets}
            on:click={handleDropdownClick}
        >
            <AssetIcon small {asset} />
            <div class="w-full relative" style="max-width: 75px;">
                <Text
                    color="gray-600"
                    darkColor="white"
                    fontWeight={FontWeight.semibold}
                    fontSize="15"
                    classes="overflow-hidden whitespace-nowrap overflow-ellipsis"
                >
                    {asset?.metadata?.name ?? asset?.id}
                </Text>
            </div>
            {#if hasMultipleAssets}
                <div class="transform rotate-0">
                    <Icon height="18" width="18" icon="chevron-down" classes="text-gray-600 dark:text-gray-500" />
                </div>
            {/if}
        </div>
        {#if isDropdownOpen && hasMultipleAssets}
            <div
                class="dropdown bg-white dark:bg-gray-800 absolute flex flex-col top-12 -left-5 -right-5 border border-solid border-blue-500 rounded-xl z-10 p-4 max-h-108"
            >
                <!-- TODO: Filter dropdown list with asset name / unit -->
                <!-- TODO: Focus input when dropdown opens -->
                <InputContainer bind:inputElement clearPadding bind:isFocused>
                    <TextInput
                        bind:inputElement
                        bind:value={searchQuery}
                        bind:hasFocus={isFocused}
                        clearBackground
                        clearBorder
                        label={localize('general.search')}
                        placeholder={localize('general.search')}
                        fontSize="sm"
                    />
                </InputContainer>
                <ul class="overflow-y-auto h-full -mr-2 pt-2 pr-2">
                    <li>
                        <AssetTile
                            onClick={() => handleAssetClick($visibleSelectedAccountAssets?.baseCoin)}
                            asset={$visibleSelectedAccountAssets?.baseCoin}
                            overrideColor
                            classes="bg-white hover:bg-gray-50 dark:bg-transparent"
                            squashed
                        />
                    </li>
                    {#each $visibleSelectedAccountAssets?.nativeTokens as nativeToken}
                        <li>
                            <AssetTile
                                onClick={() => handleAssetClick(nativeToken)}
                                asset={nativeToken}
                                overrideColor
                                classes="bg-white hover:bg-gray-50 dark:bg-transparent"
                                squashed
                            />
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    .asset-dropdown {
        font-feature-settings: 'calt' off;

        /* odd margin needed to match the size of the upper parent box */
        .dropdown {
            margin: 0 3px;
        }
    }
</style>
