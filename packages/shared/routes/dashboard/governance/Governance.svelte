<script lang="typescript">
    import { WalletPill } from 'shared/components'
    import { GovernanceHeader, GovernanceDashboard, GovernanceEventDetails } from './views'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import { participationEvents } from 'shared/lib/participation/stores'
    import { wallet } from 'shared/lib/wallet'
    import { selectedAccount, setSelectedAccount } from 'shared/lib/wallet'
    import { TREASURY_VOTE_EVENT_ID } from 'shared/lib/participation/constants'

    const { accounts } = $wallet

    function handleAccountClick(accountId: string): void {
        setSelectedAccount(accountId)
    }

    $: event = $participationEvents.find((p) => p.eventId === TREASURY_VOTE_EVENT_ID)
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoutes.Init}
        <div class="flex justify-between">
            <GovernanceHeader />
            <div>
                {#each $accounts as acc}
                    <WalletPill
                        account={acc}
                        active={acc.id === $selectedAccount?.id}
                        onClick={() => handleAccountClick(acc.id)}
                    />
                {/each}
            </div>
        </div>
        <GovernanceDashboard {event} account={$selectedAccount} />
    {:else if $governanceRoute === GovernanceRoutes.EventDetails}
        <div class="ml-auto">
            {#each $accounts as acc}
                <WalletPill
                    account={acc}
                    active={acc.id === $selectedAccount?.id}
                    onClick={() => handleAccountClick(acc.id)}
                />
            {/each}
        </div>
        <GovernanceEventDetails {event} account={$selectedAccount} />
    {/if}
</div>
