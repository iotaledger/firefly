<script lang="ts">
    import { Icon, Pill, PillBorderRadius } from 'shared/components'
    import { Icon as _Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { IProposal } from '@contexts/governance/interfaces'

    export let proposal: IProposal

    $: status = proposal?.status
    $: error = proposal?.error

    const STATUS_COLORS: { [key: string]: string } = {
        [ProposalStatus.Upcoming]: 'bg-purple-200',
        [ProposalStatus.Commencing]: 'bg-blue-200',
        [ProposalStatus.Holding]: 'bg-green-300',
        [ProposalStatus.Ended]: 'bg-gray-200',
    }
</script>

<Pill
    data={localize(`pills.governance.proposalStatus.${error ? error : status}`)}
    textColor={error ? 'red-700' : 'grey-800'}
    darkTextColor={error ? 'red-700' : 'grey-800'}
    backgroundColor={error ? 'bg-red-200' : STATUS_COLORS[status]}
    invisible={!status}
    borderRadius={PillBorderRadius.Full}
>
    {#if error}
        <Icon icon={error ? _Icon.StatusError : undefined} classes="text-red-700" />
    {/if}
</Pill>
