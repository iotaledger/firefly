<script lang="ts">
    import { WalletMainView } from './views'

    const hasAccount: boolean = false
</script>

{#if hasAccount}
    <WalletMainView />
{:else}
    <div class="flex w-full h-full p-12">
        <h1>IMPLICIT ACCOUNT</h1>
    </div>
{/if}
