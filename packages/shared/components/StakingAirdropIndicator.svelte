<script lang="typescript">
    import { Text } from 'shared/components'
    import { localize } from 'shared/lib/i18n'
    import { getStakingEventFromAirdrop } from 'shared/lib/participation'
    import { participationOverview, stakingEventState } from 'shared/lib/participation/stores'
    import { ParticipationEventState, ParticipationOverview, StakingAirdrop } from 'shared/lib/participation/types'

    export let airdrop: StakingAirdrop

    const isStakedForAirdrop = (overview: ParticipationOverview): boolean => {
        const stakingEvent = getStakingEventFromAirdrop(airdrop)
        return overview.find(
            /**
             * NOTE: This searches each account overviews participations array for a matching event ID.
             */
            (apo) => apo.participations.find((p) => p.eventId === stakingEvent.eventId) !== undefined
        ) !== undefined
    }

    let isStaked
    $: isStaked = isStakedForAirdrop($participationOverview)

    let showIndicator
    $: showIndicator = $stakingEventState === ParticipationEventState.Commencing ||
                       $stakingEventState === ParticipationEventState.Holding
</script>

<style>
    .animate--ping {
        animation: -ping 2500ms cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes -ping {
        30%, 100% {
            transform: scale(2);
            opacity: 0;
        }
    }

    .animate--pulse {
        animation: -pulse 2500ms cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes -pulse {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }
</style>


{#if showIndicator}
    <div
        class="flex flex-row justify-between items-center"
    >
        <span class="ml-4 absolute flex justify-center items-center h-3 w-3">
            {#if isStaked}
                <span id="indicator-ping" class="animate--ping absolute inline-flex h-full w-full rounded-full bg-{isStaked ? 'green' : 'red'}-400 opacity-75"></span>
            {/if}
            <span id="indicator-pulse" class="{isStaked ? '' : 'animate--pulse'} relative inline-flex rounded-full h-2 w-2 bg-{isStaked ? 'green' : 'red'}-600"></span>
        </span>
        <div
            class="pl-10 pr-5 py-2 rounded-2xl bg-white bg-opacity-20"
        >
            <Text type="p" classes="text-white dark:text-white">{localize(`general.${isStaked ? 'staking' : 'notStaked'}`)}</Text>
        </div>
    </div>
{/if}
