<script lang="typescript">
    import { AccountSwitcher, AccountActionsButton, ProfileActionsButton } from './'
    import features from '../features/features'
</script>

<div class="flex flex-row justify-between">
    {#if features?.wallet?.profileActions?.enabled}
        <ProfileActionsButton />
    {/if}
    {#if features?.wallet?.accountSwitcher?.enabled}
        <AccountSwitcher />
    {/if}
    {#if features?.wallet?.accountActions?.enabled}
        <AccountActionsButton />
    {/if}
</div>
