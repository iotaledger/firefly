<script lang="typescript">
    import { AccountSwitcher, AccountActionsButton, ProfileActionsButton } from './'
    import features from '../features/features'
</script>

<div class="flex flex-row justify-between">
    {#if features?.profileActions?.enabled}
        <ProfileActionsButton />
    {/if}
    {#if features?.accountSwitcher?.enabled}
        <AccountSwitcher />
    {/if}
    {#if features?.accountActions?.enabled}
        <AccountActionsButton />
    {/if}
</div>
