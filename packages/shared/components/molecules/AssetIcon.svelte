<script lang="ts">
    import { Icon as IconEnum, NETWORK_ICON_SVG } from '@auxiliary/icon'
    import { getIconColorFromString } from '@core/account'
    import { COIN_TYPE, NetworkId, network } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { isBright } from '@core/utils'
    import { ANIMATED_TOKEN_IDS, getAssetInitials, IPersistedAsset, TokenStandard } from '@core/wallet'
    import { Animation, Icon, NetworkIconBadge, VerificationBadge } from 'shared/components'

    export let asset: IPersistedAsset
    export let chainId: number | undefined
    export let large = false
    export let small = false

    let icon: IconEnum | null
    let assetIconColor: string
    let assetIconBackgroundColor: string
    let assetInitials: string
    let assetIconWrapperWidth: number
    let assetLogoUrl: string
    let chainName: string | undefined

    $: $network, chainId, (chainName = getTooltipText())
    $: isAnimation = asset.id in ANIMATED_TOKEN_IDS
    $: switch (asset.id) {
        case String(COIN_TYPE[NetworkId.Iota]):
            assetInitials = ''
            assetIconBackgroundColor = '#6E82A4'
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            icon = NETWORK_ICON_SVG[NetworkId.Iota]
            break
        case String(COIN_TYPE[NetworkId.Shimmer]):
        case String(COIN_TYPE[NetworkId.Testnet]):
            assetInitials = ''
            assetIconBackgroundColor = '#25DFCA'
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            icon = NETWORK_ICON_SVG[NetworkId.Shimmer]
            break
        default:
            assetInitials = getAssetInitials(asset)
            assetIconBackgroundColor = getIconColorFromString(asset.metadata?.name, {
                shades: ['500', '600', '700', '800'],
                colorsToExclude: ['gray'],
            })
            assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
            assetLogoUrl = asset.metadata?.standard === TokenStandard.Irc30 ? asset.metadata?.logoUrl ?? '' : ''
            icon = null
    }

    function getTooltipText(): string | undefined {
        const networkName = $network?.getMetadata().name
        if (chainId) {
            const chain = $network?.getChain(chainId)
            return chain?.getConfiguration().name ?? networkName
        } else {
            return networkName
        }
    }
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
                animation={ANIMATED_TOKEN_IDS[asset.id]}
                loop={true}
                renderer="canvas"
            />
        {:else if icon}
            <Icon {icon} width="80%" height="80%" classes="text-{assetIconColor ?? 'blue-500'} text-center" />
        {:else if assetLogoUrl}
            <img src={assetLogoUrl} on:error={() => (assetLogoUrl = '')} alt="" class="w-full h-full" />
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
    <span class="absolute flex justify-center items-center bottom-0 right-0">
        {#if asset.verification.verified === true}
            <NetworkIconBadge
                width={10}
                height={10}
                networkId={$activeProfile.network.id}
                {chainId}
                tooltipText={chainName}
            />
        {:else}
            <VerificationBadge status={asset.verification?.status} width={14} height={14} />
        {/if}
    </span>
</div>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
