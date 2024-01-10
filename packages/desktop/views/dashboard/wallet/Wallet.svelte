<script lang="ts">
    import { WalletMainView } from './views'

    const hasImplicitAccount: boolean = false
</script>

{#if hasImplicitAccount}
    <WalletMainView />
{:else}
    <div class="flex w-full h-full p-12">
        <h1>IMPLICIT ACCOUNT</h1>
    </div>
{/if}
