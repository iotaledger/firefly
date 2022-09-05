<script lang="typescript">
    import { selectedAccount, syncSelectedAccount } from '@core/account'
    import { Icon } from 'shared/components'

    function handleSyncAccountClick() {
        if (!$selectedAccount.isSyncing) {
            void syncSelectedAccount()
        }
    }
</script>

<button on:click={handleSyncAccountClick} class:pointer-events-none={$selectedAccount.isSyncing}>
    <Icon
        icon="refresh"
        classes="{$selectedAccount.isSyncing &&
            'animate-spin-reverse'} text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-100"
    />
</button>
