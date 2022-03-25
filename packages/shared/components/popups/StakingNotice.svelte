<script lang="typescript">
    import { Button, Illustration, Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { stakingEventState } from 'shared/lib/participation/stores'
    import { ParticipationEventState } from 'shared/lib/participation/types'
    import { closePopup, openPopup } from 'shared/lib/popup'

    $: canPreStake = $stakingEventState === ParticipationEventState.Commencing

    const getStateForLocale = (state: ParticipationEventState): ParticipationEventState => {
        switch (state) {
            case ParticipationEventState.Upcoming:
                return state
            case ParticipationEventState.Commencing:
                return state
            case ParticipationEventState.Holding:
            case ParticipationEventState.Ended:
            case ParticipationEventState.Inactive:
            default:
                return ParticipationEventState.Commencing
        }
    }

    const handleContinueClick = () => {
        const canStake = $stakingEventState === ParticipationEventState.Commencing
        if (canStake) {
            openPopup(
                {
                    type: 'stakingManager',
                },
                true
            )
        } else {
            closePopup(true)
        }
    }
</script>

<Illustration illustration="staking-notice" classes="mt-9 mb-6" />
<Text type="h4" classes="mb-4">{localize(`popups.stakingNotice.${getStateForLocale($stakingEventState)}Date`)}</Text>
<Text type="p" secondary classes="mb-6">{localize('popups.stakingNotice.body')}</Text>
<div class="flex flex-row space-x-2">
    {#if canPreStake}
        <Button secondary classes="w-1/2" onClick={closePopup}>{localize('actions.cancel')}</Button>
    {/if}
    <Button classes={canPreStake ? 'w-1/2' : 'w-full'} onClick={handleContinueClick}>
        {localize('popups.stakingNotice.ok')}
    </Button>
</div>
