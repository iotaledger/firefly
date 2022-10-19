<script lang="typescript">
    import { ActivityAsyncStatus, getTimeDifference, Activity } from '@core/wallet'
    import { TooltipIcon, Text, Pill, TileFooter, FontWeight } from 'shared/components'
    import { time } from '@core/app'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { localize } from '@core/i18n'

    export let activity: Activity

    $: timeDiff = getTimeDiff(activity)

    function getTimeDiff(_activity: Activity): string {
        if (_activity.asyncStatus === ActivityAsyncStatus.Timelocked) {
            return getTimeDifference(_activity.timelockDate, $time)
        }
        return localize('general.none')
    }
</script>

<TileFooter>
    <svelte:fragment slot="left">
        <TooltipIcon
            icon={IconEnum.Timelock}
            iconClasses="text-gray-600 dark:text-gray-200"
            title={localize('general.timelockDate')}
            text={localize(`tooltips.transactionDetails.${activity.direction}.timelockDate`)}
            position={Position.Top}
        />
        <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
    </svelte:fragment>

    <Pill slot="right" backgroundColor="gray-200" darkBackgroundColor="gray-200">
        {localize('pills.locked')}
    </Pill>
</TileFooter>
