<script lang="typescript">
    import { IAsset } from '@core/wallet'
    import { tokenRoute, TokenRoute } from '../../../../lib/routers'
    import { TokenInformation } from './views'

    export let asset: IAsset
</script>

{#if $tokenRoute === TokenRoute.Info}
    <TokenInformation {asset} />
{/if}
