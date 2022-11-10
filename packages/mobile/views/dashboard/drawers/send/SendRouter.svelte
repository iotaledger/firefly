<script lang="typescript">
    import { sendRoute, SendRoute } from '../../../../lib/routers'
    import { AmountView, RecipientView, TokenView } from './views'
</script>

{#if $sendRoute === SendRoute.Token}
    <TokenView />
{:else if $sendRoute === SendRoute.Recipient}
    <RecipientView />
{:else if $sendRoute === SendRoute.Amount}
    <AmountView />
{/if}
