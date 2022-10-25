<script lang="typescript">
    import { AccountActionsButton, AccountSwitcherButton, ProfileActionsButton } from './'
    import features from '../features/features'
</script>

<div class="grid grid-cols-4 h-10">
    <div class="col-span-1">
        {#if features?.wallet?.profileActions?.enabled}
            <ProfileActionsButton />
        {/if}
    </div>
    <div class="flex justify-center col-span-2 content-center">
        {#if features?.wallet?.accountSwitcher?.enabled}
            <AccountSwitcherButton />
        {/if}
    </div>
    <div class="flex justify-end col-span-1">
        {#if features?.wallet?.accountActions?.enabled}
            <AccountActionsButton />
        {/if}
    </div>
</div>
