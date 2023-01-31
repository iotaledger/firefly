<script lang="ts">
    import { AccountActionsButton, AccountSwitcherButton, DashboardProfileButton } from './'
    import features from '@features/features'
</script>

<div class="grid grid-cols-4 h-10">
    <div class="col-span-1">
        {#if features?.dashboard?.profileActions?.enabled}
            <DashboardProfileButton />
        {/if}
    </div>
    <div class="flex justify-center col-span-2 content-center">
        {#if features?.dashboard?.accountSwitcher?.enabled}
            <AccountSwitcherButton />
        {/if}
    </div>
    <div class="flex justify-end col-span-1">
        {#if features?.dashboard?.accountActions?.enabled}
            <AccountActionsButton />
        {/if}
    </div>
</div>
