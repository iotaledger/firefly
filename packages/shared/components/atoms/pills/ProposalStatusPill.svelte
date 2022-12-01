<script lang="typescript">
    import { Pill } from 'shared/components'
    import { ProposalStatus } from 'shared/components/enums'
    import { localize } from '@core/i18n'

    export let status: ProposalStatus

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Announcement]: 'purple-200',
        [ProposalStatus.VotingOpen]: 'blue-200',
        [ProposalStatus.Counting]: 'green-300',
        [ProposalStatus.Closed]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.proposalStatus.${status}`)}
    textColor="gray-800"
    darkTextColor="white"
    backgroundColor={STATUS_COLORS[status]}
    darkBackgroundColor={STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1"
/>
