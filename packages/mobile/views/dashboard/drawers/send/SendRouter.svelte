<script lang="typescript">
    import { sendRoute, SendRoute } from '../../../../lib/routers'
    import { Token } from './views'
</script>

{#if $sendRoute === SendRoute.Token}
    <Token />
{/if}
