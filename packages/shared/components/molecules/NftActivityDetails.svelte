<script lang="typescript">
    import { ActivityAsyncStatusPill, Icon, Pill, SubjectBox, TransactionActivityStatusPill } from 'shared/components'

    import { time } from '@core/app'
    import { localize } from '@core/i18n'
    import { NftActivity } from '@core/wallet'

    import { Icon as IconEnum } from '@lib/auxiliary/icon'

    export let activity: NftActivity

    $: isTimelocked = activity?.asyncData?.timelockDate > $time
</script>

<nft-transaction-details class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
    <div class="flex w-full items-center justify-center">
        <div class="rounded-full flex justify-center items-center transition-none p-2 w-16 h-16 bg-gray-500">
            <Icon
                icon={IconEnum.Collectibles}
                width="100%"
                height="100%"
                classes="text-white dark:text-gray-800 text-center"
            />
        </div>
    </div>
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        <transaction-status class="flex flex-row w-full space-x-2 justify-center">
            {#if activity?.inclusionState && activity?.direction}
                <TransactionActivityStatusPill
                    type={activity?.type}
                    direction={activity?.direction}
                    isInternal={activity?.isInternal}
                    inclusionState={activity?.inclusionState}
                />
            {/if}
            {#if activity?.asyncData?.asyncStatus}
                <ActivityAsyncStatusPill asyncStatus={activity?.asyncData?.asyncStatus} />
            {/if}
            {#if isTimelocked}
                <Pill backgroundColor="gray-200" darkBackgroundColor="gray-200">
                    {localize('pills.locked')}
                </Pill>
            {/if}
        </transaction-status>
        {#if activity?.subject}
            <SubjectBox subject={activity?.subject} />
        {/if}
    </main-content>
</nft-transaction-details>
