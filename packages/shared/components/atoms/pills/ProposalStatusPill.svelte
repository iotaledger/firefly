<script lang="typescript">
    import { Pill } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ProposalStatus } from '@core/governance/enums'

    export let status: ProposalStatus

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Upcoming]: 'purple-200',
        [ProposalStatus.Commencing]: 'blue-200',
        [ProposalStatus.Holding]: 'green-300',
        [ProposalStatus.Ended]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.proposalStatus.${status}`)}
    textColor="gray-800"
    darkTextColor="white"
    backgroundColor={STATUS_COLORS[status]}
    darkBackgroundColor={STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1 flex items-center"
/>
