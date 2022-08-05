<script lang="typescript">
    import { selectedAccount } from '@core/account'
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        activityFilter,
        activitySearchTerm,
        queriedActivities,
        selectedAccountActivities,
        setAsyncStatusOfAccountActivities,
    } from '@core/wallet'
    import { ActivityTile, Text, TextInput, TogglableButton, Filter } from 'shared/components'
    import { SyncSelectedAccountIconButton } from 'shared/components/atoms'
    import { FontWeightText } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'
    import { SetupType } from 'shared/lib/typings/setup'
    import { debounce } from 'shared/lib/utils'
    import { isFirstSessionSync, walletSetupType } from 'shared/lib/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { getMonthYear } from '@lib/utils'

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
    }

    $: activityListWithTitles = $queriedActivities.map((activity, index) => {
        const currentTitle = getActivityGroupTitleForTimestamp(activity.time)
        const previousTitle = $queriedActivities[index - 1]
            ? getActivityGroupTitleForTimestamp($queriedActivities[index - 1]?.time)
            : undefined
        if (currentTitle !== previousTitle || index === 0) {
            const amount = $queriedActivities.filter(
                (activity) => getActivityGroupTitleForTimestamp(activity.time) === currentTitle
            ).length

            return { title: currentTitle, amount, activity }
        } else {
            return { title: undefined, amount: undefined, activity }
        }
    })

    function getActivityGroupTitleForTimestamp(time: Date): string {
        const dateString = getMonthYear(time)
        return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
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

<div class="activity-list h-full p-6 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-4">
        <div class="relative flex flex-1 flex-row justify-between">
            <div class="flex flex-row">
                <Text type="h5" classes="mr-2">{localize('general.activity')}</Text>
                {#if features?.wallet?.activityHistory?.sync?.enabled}
                    <SyncSelectedAccountIconButton />
                {/if}
            </div>
            <div class="flex flex-row">
                {#if features?.wallet?.activityHistory?.search?.enabled}
                    <Filter filterStore={activityFilter} />
                    <TogglableButton icon="search" bind:active={searchActive} />
                {/if}
            </div>
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
    <div class="flex-auto h-full scroll-secondary pb-10">
        {#if $selectedAccount.isSyncing && shouldShowFirstSync()}
            <Text secondary classes="text-center">{localize('general.firstSync')}</Text>
        {:else if activityListWithTitles.length}
            <VirtualList items={activityListWithTitles} let:item>
                <div class="mb-2">
                    {#if item.title}
                        <Text fontWeight={FontWeightText.semibold} color="gray-600" classes="my-2">
                            {item.title} • {item.amount}
                        </Text>
                    {/if}
                    <ActivityTile activity={item.activity} />
                </div>
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize('general.noRecentHistory')}</Text>
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .activity-list :global(svelte-virtual-list-viewport) {
        margin-right: -1.25rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1rem !important;
    }
    .activity-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
