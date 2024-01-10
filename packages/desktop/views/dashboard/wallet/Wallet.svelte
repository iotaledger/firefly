<script lang="ts">
    import { WalletImplicitAccountView, WalletMainView } from './views'

    const hasAccount: boolean = false
</script>

{#if hasAccount}
    <WalletMainView />
{:else}
    <WalletImplicitAccountView />
{/if}
