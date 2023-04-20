<script lang="ts">
    import { NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { getIconColorFromString } from '@core/account'
    import { COIN_TYPE, NetworkId } from '@core/network'
    import { isBright } from '@core/utils'
    import { ANIMATED_TOKEN_IDS, IPersistedAsset, NotVerifiedStatus, getAssetInitials } from '@core/wallet'
    import { Animation, Icon, VerificationBadge } from 'shared/components'

    export let asset: IPersistedAsset
    export let large = false
    export let small = false
    export let showVerifiedBadgeOnly = false

    let icon: string
    let assetIconColor: string
    let assetIconBackgroundColor: string
    let assetInitials: string
    let assetIconWrapperWidth: number

    $: isAnimation = asset?.id in ANIMATED_TOKEN_IDS
    $: switch (asset?.id) {
        case String(COIN_TYPE[NetworkId.Iota]):
            assetInitials = ''
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            assetIconBackgroundColor = '#6E82A4'
            icon = NETWORK_ICON_SVG[NetworkId.Iota]
            break
        case String(COIN_TYPE[NetworkId.Shimmer]):
        case String(COIN_TYPE[NetworkId.Testnet]):
            assetInitials = ''
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            assetIconBackgroundColor = '#25DFCA'
            icon = NETWORK_ICON_SVG[NetworkId.Shimmer]
            break
        default:
            assetInitials = getAssetInitials(asset)
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            assetIconBackgroundColor = getIconColorFromString(asset?.metadata?.name)
            icon = ''
    }

    $: shouldShowBadge = showVerifiedBadgeOnly
        ? asset?.verification?.verified
        : asset?.verification?.status !== NotVerifiedStatus.Skipped
</script>

<div
    class="
        relative flex
        {large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
    "
>
    <div
        class="
        rounded-full flex justify-center items-center transition-none
        {isAnimation ? 'p-0' : 'p-1'}
        {large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
        {assetIconBackgroundColor ? 'icon-bg' : 'bg-blue-500'}
    "
        style={assetIconBackgroundColor ? `--icon-bg-color: ${assetIconBackgroundColor}` : ''}
        bind:clientWidth={assetIconWrapperWidth}
    >
        {#if isAnimation}
            <Animation
                classes={large ? 'w-12 h-12' : small ? 'w-6 h-6' : 'w-8 h-8'}
                animation={ANIMATED_TOKEN_IDS[asset?.id]}
                loop={true}
                renderer="canvas"
            />
        {:else if icon}
            <Icon {icon} width="80%" height="80%" classes="text-{assetIconColor ?? 'blue-500'} text-center" />
        {:else}
            <p
                style={`font-size: ${Math.floor(
                    Math.min(large ? 20 : 12, assetIconWrapperWidth / assetInitials?.length)
                )}px;`}
                class="transition-none font-600 text-{assetIconColor ?? 'blue-500'} text-center"
            >
                {assetInitials?.toUpperCase() ?? '-'}
            </p>
        {/if}
    </div>
    {#if shouldShowBadge}
        <span
            class="
                absolute flex justify-center items-center
                {small ? '-bottom-1 -right-1' : '-bottom-0.5 -right-0.5'}
            "
        >
            <VerificationBadge status={asset?.verification?.status} {large} />
        </span>
    {/if}
</div>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
