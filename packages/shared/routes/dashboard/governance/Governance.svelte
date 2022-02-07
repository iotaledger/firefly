<script lang="typescript">
    import { WalletPill } from 'shared/components'
    import { GovernanceHeader, GovernanceDashboard, GovernanceEventDetails } from './views'
    import { GovernanceRoutes } from 'shared/lib/typings/routes'
    import { governanceRoute } from 'shared/lib/router'
    import { participationEvents } from 'shared/lib/participation/stores'
    import { wallet } from 'shared/lib/wallet'
    import { get } from 'svelte/store'
    import { selectedAccountId } from 'shared/lib/wallet'
    import type { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    const { accounts } = get(wallet)

    selectedAccountId.set($accounts[0]?.id)

    function handleAccountClick(accountId) {
        selectedAccountId.set(accountId)
    }

    $: event = $participationEvents[0]
</script>

<div class="staking-wrapper w-full h-full flex flex-col flex-nowrap px-10 py-8 flex-1 bg-gray-50 dark:bg-gray-900">
    {#if $governanceRoute === GovernanceRoutes.Init}
        <div class="flex justify-between">
            <GovernanceHeader />
            <div>
                {#each $accounts as acc}
                    <WalletPill
                        account={acc}
                        active={acc.id === $selectedAccountId}
                        onClick={() => handleAccountClick(acc.id)} />
                {/each}
            </div>
        </div>
        <GovernanceDashboard {event} />
    {:else if $governanceRoute === GovernanceRoutes.EventDetails}
        <div class="ml-auto">
            {#each $accounts as acc}
                <WalletPill
                    account={acc}
                    active={acc.id === $selectedAccountId}
                    onClick={() => handleAccountClick(acc.id)} />
            {/each}
        </div>
        <GovernanceEventDetails {event} {locale} />
    {/if}
</div>
