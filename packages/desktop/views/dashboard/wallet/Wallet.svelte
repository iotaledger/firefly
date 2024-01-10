<script lang="ts">
    import { WalletImplicitAccountView, WalletMainView } from './views'

    const hasImplicitAccount: boolean = false
</script>

{#if hasImplicitAccount}
    <WalletMainView />
{:else}
    <WalletImplicitAccountView />
{/if}
