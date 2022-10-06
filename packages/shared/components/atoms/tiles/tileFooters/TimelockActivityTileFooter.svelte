<script lang="typescript">
    import { ActivityAsyncStatus, ITransactionActivityData, getTimeDifference } from '@core/wallet'
    import { TooltipIcon, Text, Pill, TileFooter } from 'shared/components'
    import { time } from '@core/app'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { Position } from 'shared/components/Tooltip.svelte'
    import { localize } from '@core/i18n'
    import { FontWeight } from 'shared/components/Text.svelte'

    export let data: ITransactionActivityData

    $: timeDiff = getTimeDiff(data)

    function getTimeDiff(txData: ITransactionActivityData): string {
        if (txData.asyncStatus === ActivityAsyncStatus.Timelocked) {
            return getTimeDifference(txData.timelockDate, $time)
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
            text={localize(`tooltips.transactionDetails.${data.direction}.timelockDate`)}
            position={Position.Top}
        />
        <Text fontSize="13" color="gray-600" fontWeight={FontWeight.semibold}>{timeDiff}</Text>
    </svelte:fragment>

    <Pill slot="right" backgroundColor="gray-200" darkBackgroundColor="gray-200">
        {localize('pills.locked')}
    </Pill>
</TileFooter>
