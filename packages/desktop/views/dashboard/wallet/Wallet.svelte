<script lang="ts">
    import { ImplicitAccountCreationView, WalletView } from './views'

    const hasAccount: boolean = false
</script>

{#if hasAccount}
    <WalletView />
{:else}
    <ImplicitAccountCreationView />
{/if}
