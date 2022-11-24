<script lang="typescript">
    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { getMonthYear } from '@core/utils'
    import { Activity, queriedActivities, setAsyncStatusOfAccountActivities } from '@core/wallet'
    import VirtualList from '@sveltejs/svelte-virtual-list'
    import { FontWeight, Text } from 'shared/components'
    import { ActivityTile } from '../../mobile/components'

    export let onTileClick: (activity: Activity) => unknown = () => {}
    export let onReject: (activity: Activity) => unknown = () => {}
    export let onClaim: (activity: Activity) => unknown = () => {}

    $: setAsyncStatusOfAccountActivities($time)

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
</script>

<div class="asset-list h-full flex flex-auto flex-col flex-grow flex-shrink-0">
    {#if activityListWithTitles.length > 0}
        <VirtualList items={activityListWithTitles} let:item>
            <div class="mb-2">
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
            </div>
        </VirtualList>
    {:else}
        <div class="h-full flex flex-col items-center justify-center text-center">
            <Text secondary>{localize('general.noRecentHistory')}</Text>
        </div>
    {/if}
</div>
