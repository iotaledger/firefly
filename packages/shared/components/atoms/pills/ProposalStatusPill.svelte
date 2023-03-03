<script lang="ts">
    import { Pill } from 'shared/components'
    import { localize } from '@core/i18n'
    import { ProposalStatus } from '@contexts/governance/enums'
    import Icon from '../Icon.svelte'

    export let status: string
    export let isNodeOutdated: boolean
    export let icon: Icon

    const STATUS_COLORS: Record<ProposalStatus, string> = {
        [ProposalStatus.Upcoming]: 'purple-200',
        [ProposalStatus.Commencing]: 'blue-200',
        [ProposalStatus.Holding]: 'green-300',
        [ProposalStatus.Ended]: 'gray-200',
    }
</script>

<Pill
    data={localize(`pills.proposalStatus.${isNodeOutdated ? 'nodeOutdated' : status}`)}
    useSlot={isNodeOutdated}
    textColor={isNodeOutdated ? 'red-700' : 'grey-800'}
    darkTextColor={isNodeOutdated ? 'red-700' : 'grey-800'}
    backgroundColor={isNodeOutdated ? 'red-200' : STATUS_COLORS[status]}
    darkBackgroundColor={isNodeOutdated ? 'red-200' : STATUS_COLORS[status]}
    classes="rounded-full px-2 py-1 flex items-center {status ? '' : 'invisible'}"
>
    {#if icon}
        <Icon {icon} classes="text-red-700" />
    {/if}
</Pill>
