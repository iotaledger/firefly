<script lang="typescript">
    import { getIconColorFromString } from '@core/account'
    import { NetworkProtocol } from '@core/network'
    import { IAsset } from '@core/wallet'
    import { getInitials, isBright } from '@lib/helpers'
    import { Icon, VerificationBadge } from 'shared/components'
    import { onMount } from 'svelte'

    export let asset: IAsset
    export let large = false
    export let showVerificationBadge = false

    const MAX_DISPLAYED_INITIALS = 5

    let icon: string
    let assetIconColor: string
    let assetIconBackgroundColor: string
    let assetInitials: string
    let assetIconWrapperWidth: number

    onMount(() => {
        if (
            asset?.metadata?.name?.toLocaleLowerCase() === NetworkProtocol.IOTA ||
            asset?.metadata?.name?.toLocaleLowerCase() === NetworkProtocol.Shimmer
        ) {
            icon = asset?.metadata?.name?.toLocaleLowerCase()
            assetIconBackgroundColor = asset?.metadata?.primaryColor
        } else {
            // Generate our own icon
            // Icon content: unit or initials
            // Icon color: deterministic color based on asset name in color range 500-800
            assetInitials =
                asset?.metadata?.unit?.slice(0, MAX_DISPLAYED_INITIALS) ??
                getInitials(asset?.metadata?.name, MAX_DISPLAYED_INITIALS)
            assetIconBackgroundColor = getIconColorFromString(asset?.metadata?.name)
        }
        assetIconColor = isBright(assetIconBackgroundColor) ? 'gray-800' : 'white'
    })
</script>

<div
    class="
        relative flex
        {large ? 'w-12 h-12' : 'w-8 h-8'}
    "
>
    <div
        class="
            p-1 rounded-full flex justify-center items-center transition-none
            {large ? 'w-12 h-12' : 'w-8 h-8'}
            {assetIconBackgroundColor ? 'icon-bg' : 'bg-blue-500'}
        "
        style={assetIconBackgroundColor ? `--icon-bg-color: ${assetIconBackgroundColor}` : ''}
        bind:clientWidth={assetIconWrapperWidth}
    >
        {#if icon}
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
