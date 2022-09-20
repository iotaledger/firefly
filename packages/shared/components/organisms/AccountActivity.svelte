<script lang="typescript">
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import {
        activityFilter,
        activitySearchTerm,
        ActivityType,
        queriedActivities,
        selectedAccountActivities,
        setAsyncStatusOfAccountActivities,
    } from '@core/wallet'
    import {
        TransactionActivityTile,
        FoundryActivityTile,
        Text,
        TextInput,
        TogglableButton,
        Filter,
    } from 'shared/components'
    import { FontWeight } from 'shared/components/Text.svelte'
    import features from 'shared/features/features'
    import { debounce } from 'shared/lib/utils'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { getMonthYear } from '@lib/utils'

    let searchActive = false
    let inputElement: HTMLInputElement
    let searchValue: string

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

    $: $activityFilter, $activitySearchTerm, scrollToTop()
    $: isEmptyBecauseOfFilter =
        $selectedAccountActivities.filter((_activity) => !_activity.isHidden).length > 0 &&
        activityListWithTitles.length === 0

    function scrollToTop(): void {
        const listElement = document.querySelector('.activity-list')?.querySelector('svelte-virtual-list-viewport')
        if (listElement) {
            listElement.scroll(0, 0)
        }
    }

    function getActivityGroupTitleForTimestamp(time: Date): string {
        const dateString = getMonthYear(time)
        return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
    }
</script>

<div class="activity-list h-full p-6 flex flex-col flex-auto flex-grow flex-shrink-0">
    <div class="mb-4">
        <div class="relative flex flex-1 flex-row justify-between">
            <Text type="h5">{localize('general.activity')}</Text>
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
                    clearPadding
                    containerClasses="p-3"
                    fontWeight={FontWeight.medium}
                    color="gray-500"
                />
            </div>
        {/if}
    </div>
    <div class="flex-auto h-full pb-10">
        {#if activityListWithTitles.length > 0}
            <VirtualList items={activityListWithTitles} let:item>
                <div class="mb-2">
                    {#if item.title}
                        <Text fontWeight={FontWeight.semibold} color="gray-600" classes="my-2">
                            {item.title} • {item.amount}
                        </Text>
                    {/if}
                    {#if item.activity.data.type === ActivityType.Transaction}
                        <TransactionActivityTile
                            activityId={item.activity.id}
                            inclusionState={item.activity.inclusionState}
                            fiatAmount={item.activity.getFiatAmount()}
                            amount={item.activity.getFormattedAmount(false)}
                            data={item.activity.data}
                        />
                    {:else}
                        <FoundryActivityTile
                            activityId={item.activity.id}
                            inclusionState={item.activity.inclusionState}
                            fiatAmount={item.activity.getFiatAmount()}
                            amount={item.activity.getFormattedAmount(false)}
                            data={item.activity.data}
                        />
                    {/if}
                </div>
            </VirtualList>
        {:else}
            <div class="h-full flex flex-col items-center justify-center text-center">
                <Text secondary
                    >{localize(`general.${isEmptyBecauseOfFilter ? 'noFilteredActivity' : 'noRecentHistory'}`)}</Text
                >
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .activity-list :global(svelte-virtual-list-viewport) {
        margin-right: -1rem !important;
        flex: auto;
        overflow-y: scroll;
        padding-right: 1.5rem !important;
    }
    .activity-list :global(svelte-virtual-list-contents) {
        margin-right: -1rem !important;
    }
</style>
