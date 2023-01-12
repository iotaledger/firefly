<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        GovernanceActivity,
        getActivityTileTitle,
        GovernanceAction,
        formatTokenAmountBestMatch,
    } from '@core/wallet'
    import { Text, Icon, FontWeight } from 'shared/components'
    import { Icon as IconEnum } from '@lib/auxiliary/icon'
    import { BASE_TOKEN } from '@core/network'
    import { activeProfile } from '@core/profile'

    export let activity: GovernanceActivity

    $: amount = getAmount(activity)
    $: title = getActivityTileTitle(activity)

    function getAmount(activity: GovernanceActivity) {
        const metadata = BASE_TOKEN[$activeProfile?.networkProtocol]
        if (
            activity.governanceAction === GovernanceAction.IncreaseVotingPower ||
            activity.governanceAction === GovernanceAction.DecreaseVotingPower
        ) {
            const amount = formatTokenAmountBestMatch(activity.votingPowerDifference, metadata, 2)
            return `${activity.governanceAction === GovernanceAction.DecreaseVotingPower ? '- ' : ''}${amount}`
        }
    }
</script>

<div class="relative flex w-8 h-8">
    <div class="rounded-full flex justify-center items-center transition-none p-1 w-8 h-8 bg-gray-500">
        <Icon
            icon={IconEnum.Governance}
            width="83.33333%"
            height="83.33333%"
            classes="text-white dark:text-gray-800 text-center"
        />
    </div>
</div>
<div class="flex flex-col w-full space-y-0.5">
    <div class="flex flex-row justify-between">
        <Text
            fontWeight={FontWeight.semibold}
            lineHeight="140"
            classes="overflow-hidden overflow-ellipsis multiwrap-line2"
        >
            {localize(title)}
        </Text>
        {#if amount}
            <Text fontWeight={FontWeight.medium} lineHeight="140" color="gray-600">
                {amount}
            </Text>
        {/if}
    </div>
</div>
