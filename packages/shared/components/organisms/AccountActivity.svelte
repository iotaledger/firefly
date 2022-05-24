<script lang="typescript">
    import { ActivityRow, TogglableButton, Text, TextInput } from 'shared/components'
    import { localize } from '@core/i18n'
    import { openPopup } from 'shared/lib/popup'
    import { isSyncing, isFirstSessionSync, walletSetupType } from 'shared/lib/wallet'
    import { SetupType } from 'shared/lib/typings/setup'
    import { debounce } from 'shared/lib/utils'
    import { activities, groupedActivities, filterQueriedActivities, searchQueriedActivities } from '@core/wallet'

    function handleTransactionClick(message: any): void {
        openPopup({
            type: 'activityDetails',
            props: { message },
        })
    }

    const filters = ['all', 'incoming', 'outgoing']
    $: activeFilterIndex = searchActive ? 0 : activeFilterIndex || 0

    let searchActive = false
    let inputElement: HTMLInputElement
    let searchValue: string
    $: if (searchActive && inputElement) inputElement.focus()
    $: searchValue = searchActive ? searchValue.toLowerCase() : ''

    $: if (searchActive && searchValue) {
        debounce(() => {
            searchQueriedActivities(searchValue)
        })()
    } else {
        filterQueriedActivities(activeFilterIndex)
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
        return $isFirstSessionSync && $walletSetupType && $walletSetupType !== SetupType.New && $activities.length === 0
    }
</script>

<div class="h-full p-6 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-5">
        <div class="relative flex flex-1 flex-row justify-between">
            <Text type="h5">{localize('general.transactions')}</Text>
            <TogglableButton icon="search" bind:active={searchActive} />
        </div>
        <div class="relative flex flex-row items-center justify-between text-white mt-4">
            {#if searchActive}
                <TextInput
                    bind:inputElement
                    bind:value={searchValue}
                    hasFocus={true}
                    placeholder={localize('general.search')}
                    fontSize="15"
                />
            {/if}
            <!-- TODO: Wait for screen design for these -->
            <!-- <ul class="flex flex-row justify-between space-x-8">
                {#each filters as filter, i}
                    <li on:click={() => (activeFilterIndex = i)}>
                        <Text
                            type="p"
                            overrideColor
                            classes="cursor-pointer
                        {activeFilterIndex === i
                                ? 'text-blue-500 border-b-2 border-blue-500 border-solid'
                                : 'text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}"
                        >
                            {localize(`general.${filter}`)}
                        </Text>
                    </li>
                {/each}
            </ul> -->
        </div>
    </div>
    <div class="overflow-y-auto flex-auto h-1 space-y-2.5 -mr-2 pr-2 scroll-secondary">
        {#if $isSyncing && shouldShowFirstSync()}
            <Text secondary classes="text-center">{localize('general.firstSync')}</Text>
        {:else if $groupedActivities.length}
            {#each $groupedActivities as group}
                <Text bold smaller color="gray-600">{group.date} • {group.activities.length}</Text>
                {#each group.activities as activity}
                    <ActivityRow onClick={() => handleTransactionClick(activity)} {activity} />
                {/each}
            {/each}
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary>{localize('general.noRecentHistory')}</Text>
            </div>
        {/if}
    </div>
</div>
