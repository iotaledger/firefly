<script lang="typescript">
    import { IAsset } from '@core/wallet'
    import { onDestroy } from 'svelte'
    import { tokenRoute, TokenRoute, tokenRouter } from '../../../../lib/routers'
    import { TokenInformation } from './views'

    export let asset: IAsset

    onDestroy(() => {
        $tokenRouter.reset()
    })
</script>

{#if $tokenRoute === TokenRoute.Info}
    <TokenInformation {asset} />
{/if}
