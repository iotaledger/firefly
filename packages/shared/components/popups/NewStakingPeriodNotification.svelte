<script lang="typescript">
    import { formatDate, LocaleArguments, localize } from '@core/i18n'
    import { getAccountParticipationAbility } from '@lib/participation/participation'
    import { assemblyStakingEventState, shimmerStakingEventState } from '@lib/participation/stores'
    import { AccountParticipationAbility } from '@lib/participation/types'
    import { closePopup, openPopup } from '@lib/popup'
    import { selectedAccountStore } from '@lib/wallet'
    import { Button, Illustration, Text, TextHint } from 'shared/components'
    import {
        ASSEMBLY_EVENT_START_DATE,
        isParticipationPossible,
        LAST_ASSEMBLY_STAKING_PERIOD,
    } from '@lib/participation'

    function getLocaleArguments(): LocaleArguments {
        return {
            values: {
                periodNumber: LAST_ASSEMBLY_STAKING_PERIOD + 1,
                date: formatDate(ASSEMBLY_EVENT_START_DATE, { format: 'long' }),
            },
        }
    }

    function handleOk(): void {
        const isParticipationPossibleForAssembly = isParticipationPossible($assemblyStakingEventState)
        const isParticipationPossibleForShimmer = isParticipationPossible($shimmerStakingEventState)
        const cannotStake =
            getAccountParticipationAbility($selectedAccountStore) === AccountParticipationAbility.HasDustAmount

        if ((isParticipationPossibleForAssembly || isParticipationPossibleForShimmer) && !cannotStake) {
            openPopup({
                type: 'stakingManager',
            })
        } else {
            closePopup(true)
        }
    }
</script>

<Illustration illustration="staking-notification" classes="mb-4" />
<Text type="h3" classes="mb-2">{localize('popups.newStakingPeriodNotification.title', getLocaleArguments())}</Text>
<Text type="p" secondary classes="mb-4"
    >{localize('popups.newStakingPeriodNotification.body', getLocaleArguments())}</Text
>
<TextHint
    classes="p-4 mb-4 rounded-2xl bg-blue-50 dark:bg-gray-800"
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
