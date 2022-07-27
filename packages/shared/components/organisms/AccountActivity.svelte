<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        activityFilterIndex,
        activitySearchTerm,
        groupedActivities,
        selectedAccountActivities,
        setAsyncStatusOfAccountActivities,
    } from '@core/wallet'
    import { ActivityTile, Text, TextInput, TogglableButton } from 'shared/components'
    import { SyncSelectedAccountIconButton } from 'shared/components/atoms'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'
    import { SetupType } from 'shared/lib/typings/setup'
    import { debounce } from 'shared/lib/utils'
    import { isFirstSessionSync, walletSetupType } from 'shared/lib/wallet'

    let searchActive = false
    let inputElement: HTMLInputElement
    let searchValue: string

    $: activeFilterIndex = searchActive ? 0 : activeFilterIndex || 0
    $: if (searchActive && inputElement) inputElement.focus()
    $: searchValue = searchActive ? searchValue.toLowerCase() : ''
    $: setAsyncStatusOfAccountActivities($time)
    $: if (searchActive && $selectedAccountActivities) {
        debounce(() => {
            $activitySearchTerm = searchValue
        })()
    } else {
        $activityFilterIndex = activeFilterIndex
    }

    function shouldShowFirstSync(): boolean {
        /**
         * NOTE: The following conditions must be satisfied
         * for the "syncing history, ..." message to show:
         *
         *      1. It must be the first sync of the user's session
         *      2. The wallet setup type must exist (a null value indicates an existing profile)
         *      3. The wallet setup type cannot be new (if it's new then there's no tx history to sync)
         *      4. Account must have no transactions (the length of $transactions must be zero)
         */
        return (
            $isFirstSessionSync &&
            $walletSetupType &&
            $walletSetupType !== SetupType.New &&
            $selectedAccountActivities.length === 0
        )
    }
</script>

<div class="h-full p-6 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-4">
        <div class="relative flex flex-1 flex-row justify-between">
            <div class="flex flex-row">
                <Text type="h5" classes="mr-2">{localize('general.activity')}</Text>
                {#if features?.wallet?.activityHistory?.sync?.enabled}
                    <SyncSelectedAccountIconButton />
                {/if}
            </div>
            {#if features?.wallet?.activityHistory?.search?.enabled}
                <TogglableButton icon="search" bind:active={searchActive} />
            {/if}
        </div>
        {#if features?.wallet?.activityHistory?.search?.enabled && searchActive}
            <div class="relative flex flex-row items-center justify-between text-white mt-4">
                <TextInput
                    bind:inputElement
                    bind:value={searchValue}
                    hasFocus={true}
                    placeholder={localize('general.search')}
                    fontSize="15"
                    fontWeight={FontWeightText.medium}
                    color="gray-500"
                />
            </div>
        {/if}
    </div>
    <div class="overflow-y-scroll flex-auto h-1 space-y-4 -mr-5 pr-4 scroll-secondary">
        <div class="-mr-4 overflow-x-visible">
            {#if $selectedAccount.isSyncing && shouldShowFirstSync()}
                <Text secondary classes="text-center">{localize('general.firstSync')}</Text>
            {:else if $groupedActivities.length}
                <div class="space-y-4">
                    {#each $groupedActivities as group}
                        <div class="space-y-2">
                            <Text fontWeight={FontWeightText.semibold} color="gray-600">
                                {group.date} • {group.activities.length}
                            </Text>
                            {#each group.activities as activity}
                                <ActivityTile {activity} />
                            {/each}
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="h-full flex flex-col items-center justify-center text-center">
                    <Text secondary>{localize('general.noRecentHistory')}</Text>
                </div>
            {/if}
        </div>
    </div>
</div>
