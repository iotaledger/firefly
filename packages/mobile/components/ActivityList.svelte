<script lang="ts">
    import { activityFilter, queriedActivities } from '@core/wallet/stores'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { FontWeight, Text } from 'shared/components'
    import { ActivityTile, Filter, SearchInput } from '../../mobile/components'
    import { FilterType } from '../lib/routers/routers/dashboard'
    import { time } from '@core/app'
    import { getGroupSeparator, localize } from '@core/i18n'
    import { getMonthYear } from '@core/utils'
    import {
        Activity,
        ActivityType,
        getActivityTileTitle,
        getFormattedAmountFromActivity,
        setAsyncStatusOfAccountActivities,
    } from '@core/wallet'

    type ActivityTileData = {
        title: string | undefined
        amount: number | undefined
        activity: Activity
    }

    export let onTileClick: (activity: Activity) => unknown = () => {}
    export let onReject: (activity: Activity) => unknown = () => {}
    export let onClaim: (activity: Activity) => unknown = () => {}

    let searchValue = ''

    $: setAsyncStatusOfAccountActivities($time)
    $: activityTileDataList = searchActivities(getActivityTileDataList($queriedActivities), searchValue)

    function getActivityGroupTitleForTimestamp(time: Date): string {
        const dateString = getMonthYear(time)
        return dateString === getMonthYear(new Date()) ? localize('general.thisMonth') : dateString
    }

    function getActivityTileDataList(activities: Activity[]): ActivityTileData[] {
        return activities.map((activity, index) => {
            const currentTitle = getActivityGroupTitleForTimestamp(activity.time)
            const previousTitle =
                activities[index - 1] && getActivityGroupTitleForTimestamp(activities[index - 1]?.time)
            if (currentTitle !== previousTitle || index === 0) {
                const amount = activities.filter(
                    (activity) => getActivityGroupTitleForTimestamp(activity.time) === currentTitle
                ).length

                return { title: currentTitle, amount, activity }
            } else {
                return { title: undefined, amount: undefined, activity }
            }
        })
    }

    function searchActivities(activities: ActivityTileData[], searchValue: string): ActivityTileData[] {
        if (!activities || !searchValue) {
            return activities
        }

        const searchTerm = searchValue.toLowerCase()
        const filteredActivities = activities?.filter((activity) => {
            const title = localize(getActivityTileTitle(activity?.activity))?.toLowerCase()
            const transactionId = activity?.activity?.transactionId?.toLowerCase()

            const addressOrName =
                activity?.activity?.subject?.type === 'address'
                    ? activity?.activity?.subject?.address?.toLowerCase()
                    : activity?.activity?.subject?.account?.name?.toLowerCase()

            const amount = getFormattedAmountFromActivity(
                activity?.activity?.type === ActivityType.Basic || activity?.activity?.type === ActivityType.Foundry
                    ? activity?.activity
                    : undefined
            )
                ?.toLowerCase()
                ?.replace(getGroupSeparator(), '')

            return [title, transactionId, addressOrName, amount].some((item) => item?.includes(searchTerm))
        })
        return filteredActivities
    }
</script>

<activity-list-container class="asset-list h-full flex flex-auto flex-col flex-grow flex-shrink-0">
    <activity-list-header class="flex justify-between items-center">
        <search-input-container class="block flex-1">
            <SearchInput bind:value={searchValue} />
        </search-input-container>
        <Filter filterStoreValue={$activityFilter} filterType={FilterType.Activity} />
    </activity-list-header>
    {#if activityTileDataList.length > 0}
        <VirtualList items={activityTileDataList} let:item>
            <activity-tile-container class="block mb-2">
                {#if item.title}
                    <Text fontWeight={FontWeight.semibold} color="gray-600" classes="my-2">
                        {item.title} • {item.amount}
                    </Text>
                {/if}
                <ActivityTile
                    activity={item.activity}
                    onClick={() => onTileClick(item.activity)}
                    onClaim={() => onClaim(item.activity)}
                    onReject={() => onReject(item.activity)}
                />
            </activity-tile-container>
        </VirtualList>
    {:else}
        <text-container class="h-full flex flex-col items-center justify-center text-center">
            <Text secondary>{localize('general.noRecentHistory')}</Text>
        </text-container>
    {/if}
</activity-list-container>
