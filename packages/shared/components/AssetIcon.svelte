<script lang="ts">
    import { AnimationRenderer } from '@auxiliary/animation'
    import { Icon as IconEnum, NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { getIconColorFromString } from '@core/account'
    import { COIN_TYPE, NetworkId } from '@core/network'
    import { isBright } from '@core/utils'
    import { ANIMATED_TOKEN_IDS, getAssetInitials, IPersistedAsset, TokenStandard } from '@core/wallet'
    import { Animation, AssetIconSize, Icon, VerificationBadge } from 'shared/components'

    export let asset: IPersistedAsset
    export let size: AssetIconSize = AssetIconSize.Medium

    let icon: IconEnum | null
    let assetIconColor: string = 'text-blue-500'
    let assetIconBackgroundColor: string
    let assetInitials: string
    let assetIconWrapperWidth: number
    let assetLogoUrl: string

    $: isAnimation = asset.id in ANIMATED_TOKEN_IDS
    $: asset, updateAssetIcon()
    $: assetIconColor = isBright(assetIconBackgroundColor) ? 'text-gray-800' : 'text-white'

    function updateAssetIcon(): void {
        switch (asset.id) {
            case String(COIN_TYPE[NetworkId.Iota]):
            case String(COIN_TYPE[NetworkId.IotaAlphanet]):
                assetIconBackgroundColor = '#6E82A4'
                icon = NETWORK_ICON_SVG[NetworkId.Iota]
                break
            case String(COIN_TYPE[NetworkId.Shimmer]):
            case String(COIN_TYPE[NetworkId.ShimmerTestnet]):
                assetIconBackgroundColor = '#25DFCA'
                icon = NETWORK_ICON_SVG[NetworkId.Shimmer]
                break
            default:
                assetInitials = getAssetInitials(asset)
                assetIconBackgroundColor = getIconColorFromString(asset.metadata?.name, {
                    shades: ['500', '600', '700', '800'],
                    colorsToExclude: ['gray'],
                })
                assetLogoUrl = asset.metadata?.standard === TokenStandard.Irc30 ? asset.metadata?.logoUrl ?? '' : ''
                icon = null
        }
    }

    function handleOnError(): void {
        assetLogoUrl = ''
    }
</script>

<asset-icon-wrapper class:large={AssetIconSize.Large === size} class:small={AssetIconSize.Small === size}>
    <asset-icon
        class:isAnimation
        class:large={AssetIconSize.Large === size}
        class:small={AssetIconSize.Small === size}
        class:icon-bg={assetIconBackgroundColor}
        style={assetIconBackgroundColor ? `--icon-bg-color: ${assetIconBackgroundColor}` : ''}
        bind:clientWidth={assetIconWrapperWidth}
    >
        {#if isAnimation}
            <Animation
                classes={AssetIconSize.Large === size
                    ? 'w-12 h-12'
                    : AssetIconSize.Small === size
                    ? 'w-6 h-6'
                    : 'w-8 h-8'}
                animation={ANIMATED_TOKEN_IDS[asset.id]}
                loop={true}
                renderer={AnimationRenderer.Canvas}
            />
        {:else if icon}
            <Icon {icon} width="80%" height="80%" classes="{assetIconColor} text-center" />
        {:else if assetLogoUrl}
            <img src={assetLogoUrl} on:error={handleOnError} alt={assetLogoUrl} class="w-full h-full" />
        {:else}
            <p
                style:--font-size={Math.floor(
                    Math.min(AssetIconSize.Large === size ? 20 : 12, assetIconWrapperWidth / assetInitials?.length)
                ) + 'px'}
                class={assetIconColor}
            >
                {assetInitials?.toUpperCase() ?? '-'}
            </p>
        {/if}
    </asset-icon>
    <verification-badge-wrapper class="absolute flex justify-center items-center bottom-0 right-0">
        <VerificationBadge status={asset.verification?.status} width={14} height={14} />
    </verification-badge-wrapper>
</asset-icon-wrapper>

<style lang="scss">
    asset-icon-wrapper {
        @apply relative;
        @apply flex;
        @apply w-8 h-8;
        &.large {
            @apply w-12 h-12;
        }
        &.small {
            @apply w-6 h-6;
        }
        asset-icon {
            @apply p-1;
            @apply rounded-full;
            @apply flex justify-center items-center;
            @apply transition-none;
            @apply bg-blue-500;
            @apply w-8 h-8;
            &.isAnimation {
                @apply p-0;
            }
            &.large {
                @apply w-12 h-12;
            }
            &.small {
                @apply w-6 h-6;
            }

            &.icon-bg {
                background-color: var(--icon-bg-color);
            }
            p {
                @apply transition-none;
                @apply font-600;
                @apply text-center;
                font-size: var(--font-size);
            }
        }
    }
</style>
