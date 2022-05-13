<script lang="typescript">
    import { localize } from '@core/i18n'
    import { activeProfile } from '@core/profile'
    import { selectedAccount } from '@core/account'
    import { Pane, Text, AccountAssetsList } from 'shared/components'
</script>

<Pane classes="h-full -mt-5 z-0">
    {#if $activeProfile?.hiddenAccounts?.includes($selectedAccount?.id)}
        <div class="px-6 my-4">
            <Text type="p" secondary>{localize('general.accountRemoved')}</Text>
        </div>
    {:else}
        <AccountAssetsList />
    {/if}
</Pane>
