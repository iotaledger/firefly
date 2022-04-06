<script lang="typescript">
    import { localize } from '@core/i18n'
    import { getAccountParticipationAbility } from '@lib/participation/participation'
    import { stakingEventState } from '@lib/participation/stores'
    import { AccountParticipationAbility, ParticipationEventState } from '@lib/participation/types'
    import { closePopup, openPopup } from '@lib/popup'
    import { selectedAccount } from '@lib/wallet'
    import { Button, Icon, Illustration, Text, TextHint } from 'shared/components'

    function handleOk(): void {
        const canStake =
            $stakingEventState === ParticipationEventState.Commencing ||
            $stakingEventState === ParticipationEventState.Holding
        const cannotStake =
            getAccountParticipationAbility($selectedAccount) === AccountParticipationAbility.HasDustAmount

        if (canStake && !cannotStake) {
            openPopup({
                type: 'stakingManager',
            })
        } else {
            closePopup(true)
        }
    }
</script>

<Illustration illustration="staking-notification" classes="mb-6 mt-9" />
<Text type="h3" classes="mb-4">{localize('popups.newStakingPeriodNotification.title')}</Text>
<Text type="p" secondary classes="mb-6">{localize('popups.newStakingPeriodNotification.body')}</Text>
<TextHint
    classes="p-4 mb-6 rounded-2xl bg-blue-50 dark:bg-gray-800"
    icon="info"
    iconClasses="fill-current text-blue-500"
    hint={localize('popups.newStakingPeriodNotification.info')}
    hintClasses="text-gray-500 dark:text-gray-500"
/>
<div class="flex flex-row space-x-2">
    <Button classes="w-full" onClick={handleOk}>
        {localize('actions.okIUnderstand')}
    </Button>
</div>
