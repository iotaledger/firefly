<script lang="typescript">
    import { localize } from '@core/i18n'
    import { IAsset, NotVerifiedStatus, TokenStandard } from '@core/wallet'
    import { AssetActionsButton } from 'shared/components'
    import { Drawer } from '../../../../components'
    import { TokenRoute, tokenRoute } from '../../../../lib/routers'
    import TokenRouter from './TokenRouter.svelte'

    export let asset: IAsset
    export let onClose: () => unknown = () => {}

    const fullScreen: boolean = true

    $: title =
        asset?.verification?.status === NotVerifiedStatus.New
            ? localize('popups.tokenInformation.newTokenTitle')
            : asset?.metadata?.name
</script>

<Drawer {onClose} {title} {fullScreen}>
    <div class="absolute right-8">
        {#if asset?.standard === TokenStandard.Irc30 && $tokenRoute === TokenRoute.Info}
            <AssetActionsButton {asset} />
        {/if}
    </div>
    <TokenRouter {asset} />
</Drawer>
