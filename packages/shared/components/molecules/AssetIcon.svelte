<script lang="typescript">
    import { NetworkProtocol } from '@core/network'
    import { IAsset } from '@core/wallet'
    import { isBright } from '@lib/helpers'
    import { Icon, VerificationBadge } from 'shared/components'

    export let asset: IAsset
    export let large = false
    export let showVerificationBadge = false

    let icon: string

    $: assetIconColor = isBright(asset?.metadata?.primaryColor) ? 'gray-800' : 'white'
    $: switch (asset?.metadata?.name?.toLocaleLowerCase()) {
        case NetworkProtocol.IOTA:
        case NetworkProtocol.Shimmer:
            icon = asset?.metadata?.name?.toLocaleLowerCase()
            break
        default:
            icon = 'tokens'
    }
</script>

<div
    class="
        relative flex
        {large ? 'w-12 h-12' : 'w-8 h-8'}
    "
>
    <div
        class="
            p-1 rounded-full flex justify-center items-center
            {large ? 'w-12 h-12' : 'w-8 h-8'}
            {asset?.metadata?.primaryColor ? 'icon-bg' : 'bg-blue-500'}
        "
        style={asset?.metadata?.primaryColor ? `--icon-bg-color: ${asset?.metadata?.primaryColor}` : ''}
    >
        <Icon {icon} width="80%" height="80%" classes="text-{assetIconColor ?? 'blue-500'} text-center" />
    </div>
    {#if showVerificationBadge}
        <span class="absolute flex justify-center items-center h-4 w-4 -bottom-0.5 -right-0.5">
            <VerificationBadge verificationStatus={asset.verification} {large} />
        </span>
    {/if}
</div>

<style type="text/scss">
    .icon-bg {
        background-color: var(--icon-bg-color);
    }
</style>
