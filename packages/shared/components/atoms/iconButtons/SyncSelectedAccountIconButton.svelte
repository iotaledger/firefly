<script lang="typescript">
    import { selectedAccount, syncSelectedAccount } from '@core/account'
    import { isSoftwareProfile } from '@core/profile'
    import { checkStronghold } from '@lib/stronghold'
    import { Icon } from 'shared/components'

    function handleSyncAccountClick() {
        if (!$selectedAccount.isSyncing) {
            if ($isSoftwareProfile) {
                void checkStronghold(syncSelectedAccount)
            } else {
                void syncSelectedAccount()
            }
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
