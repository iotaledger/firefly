<script lang="typescript">
    import { sendRoute, SendRoute } from '../../../../lib/routers'
    import { Recipient, Token } from './views'
</script>

{#if $sendRoute === SendRoute.Token}
    <Token />
{:else if $sendRoute === SendRoute.Recipient}
    <Recipient />
{/if}
