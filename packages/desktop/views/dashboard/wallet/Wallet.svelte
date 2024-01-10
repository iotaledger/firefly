<script lang="ts">
    import { Wallet } from './subviews/'

    const hasImplicitAccount: boolean = false
</script>

{#if hasImplicitAccount}
    <Wallet />
{:else}
    <div class="flex w-full h-full p-12">
        <h1>IMPLICIT ACCOUNT</h1>
    </div>
{/if}
