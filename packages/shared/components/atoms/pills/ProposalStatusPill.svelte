<script lang="ts">
    import { Icon, Pill } from 'shared/components'
    import { Icon as _Icon } from '@auxiliary/icon'
    import { localize } from '@core/i18n'
    import { ProposalErrorMode, ProposalStatus } from '@contexts/governance/enums'

    export let status: string
    export let errorMode: ProposalErrorMode

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Upcoming]: 'purple-200',
        [ProposalStatus.Commencing]: 'blue-200',
        [ProposalStatus.Holding]: 'green-300',
        [ProposalStatus.Ended]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.governance.proposalStatus.${errorMode ? errorMode : status}`)}
    textColor={errorMode ? 'red-700' : 'grey-800'}
    darkTextColor={errorMode ? 'red-700' : 'grey-800'}
    backgroundColor={errorMode ? 'red-200' : STATUS_COLORS[status]}
    darkBackgroundColor={errorMode ? 'red-200' : STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1 flex items-center {status ? '' : 'invisible'}"
>
    {#if errorMode}
        <Icon icon={errorMode ? _Icon.StatusError : undefined} classes="text-red-700" />
    {/if}
</Pill>
