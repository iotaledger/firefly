<script lang="typescript">
    import { sendRoute, SendRoute } from '../../../../lib/routers'
    import { AmountView, ConfirmView, RecipientView, TokenView } from './views'
</script>

{#if $sendRoute === SendRoute.Token}
    <TokenView />
{:else if $sendRoute === SendRoute.Recipient}
    <RecipientView />
{:else if $sendRoute === SendRoute.Amount}
    <AmountView />
{:else if $sendRoute === SendRoute.Confirm}
    <ConfirmView />
{/if}
