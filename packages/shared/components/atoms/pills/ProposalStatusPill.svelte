<script lang="ts">
    import { Icon, Pill } from 'shared/components'
    import { Icon as _Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { ProposalStatus } from '@contexts/governance/enums'
    import { IProposal } from '@contexts/governance/interfaces'

    export let proposal: IProposal

    $: status = proposal?.status
    $: error = proposal?.error

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Upcoming]: 'purple-200',
        [ProposalStatus.Commencing]: 'blue-200',
        [ProposalStatus.Holding]: 'green-300',
        [ProposalStatus.Ended]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.governance.proposalStatus.${error ? error : status}`)}
    textColor={error ? 'red-700' : 'grey-800'}
    darkTextColor={error ? 'red-700' : 'grey-800'}
    backgroundColor={error ? 'red-200' : STATUS_COLORS[status]}
    darkBackgroundColor={error ? 'red-200' : STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1 flex items-center {status ? '' : 'invisible'}"
>
    {#if error}
        <Icon icon={error ? _Icon.StatusError : undefined} classes="text-red-700" />
    {/if}
</Pill>
