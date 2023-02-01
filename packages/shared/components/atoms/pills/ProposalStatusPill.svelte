<script lang="ts">
    import { Pill } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ProposalStatus } from '@contexts/governance/enums'

    export let status: string

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Upcoming]: 'purple-200',
        [ProposalStatus.Commencing]: 'blue-200',
        [ProposalStatus.Holding]: 'green-300',
        [ProposalStatus.Ended]: 'gray-200',
    }
</script>

{#if status}
    <Pill
        data={localize(`pills.proposalStatus.${status}`)}
        textColor="gray-800"
        darkTextColor="gray-800"
        backgroundColor={STATUS_COLORS[status]}
        darkBackgroundColor={STATUS_COLORS[status]}
        classes="rounded-full px-2 py-1 flex items-center"
    />
{/if}
