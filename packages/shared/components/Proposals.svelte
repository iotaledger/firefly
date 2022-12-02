<script lang="typescript">
    import { ProposalStatusInfo, Text, TooltipIcon } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeight, Position, ProposalStatus } from './enums'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { GovernanceRoute, governanceRouter } from '@core/router'
    import { selectedProposal } from '@core/governance'

    // used data to display in UI
    type Proposal = {
        dao?: DAO
        title: string
        status: ProposalStatus
        hasVoted?: boolean
        milestones?: Record<ProposalStatus, number>
    }

    // future DAO type
    type DAO = {
        name: string
        icon: IconEnum
    }

    // mocked DAO
    const IotaDAO: DAO = {
        name: 'IOTA Foundation',
        icon: IconEnum.Iota,
    }

    // mocked proposals
    const proposals: Proposal[] = [
        {
            title: 'Important Soonaverse decision',
            status: ProposalStatus.Announcement,
        },
        {
            dao: IotaDAO,
            title: 'The New Shimmer Governance',
            status: ProposalStatus.VotingOpen,
            hasVoted: true,
        },
        {
            dao: IotaDAO,
            title: 'Short proposal',
            status: ProposalStatus.Counting,
            hasVoted: true,
        },
        {
            title: 'Medium long proposal',
            status: ProposalStatus.Counting,
            hasVoted: true,
        },
        {
            title: 'Important proposal',
            status: ProposalStatus.Counting,
        },
        {
            title: 'Future DAO proposal',
            status: ProposalStatus.Closed,
            hasVoted: true,
        },
        {
            title: 'DAO decisions',
            status: ProposalStatus.Closed,
        },
        {
            title: 'Super extra double very long proposal',
            status: ProposalStatus.Closed,
        },
        {
            title: 'Super extra double very long proposal',
            status: ProposalStatus.Closed,
        },
        {
            dao: IotaDAO,
            title: 'DAO decisions',
            status: ProposalStatus.Closed,
        },
    ]

    // just used to mock data
    function getMilestonesFromStatus(status: ProposalStatus): Record<ProposalStatus, number> {
        const milestones: Record<ProposalStatus, number> = {
            [ProposalStatus.Announcement]: 3359093,
            [ProposalStatus.VotingOpen]: 3359093,
            [ProposalStatus.Counting]: 3359093,
            [ProposalStatus.Closed]: 3359093,
        }

        switch (status) {
            case ProposalStatus.Announcement:
                milestones[ProposalStatus.Announcement] = 2359093
                break
            case ProposalStatus.VotingOpen:
                milestones[ProposalStatus.Announcement] = 2359093
                milestones[ProposalStatus.VotingOpen] = 2359093
                break
            case ProposalStatus.Counting:
                milestones[ProposalStatus.Announcement] = 2359093
                milestones[ProposalStatus.VotingOpen] = 2359093
                milestones[ProposalStatus.Counting] = 2359093
                break
            case ProposalStatus.Closed:
                milestones[ProposalStatus.Announcement] = 2359093
                milestones[ProposalStatus.VotingOpen] = 2359093
                milestones[ProposalStatus.Counting] = 2359093
                milestones[ProposalStatus.Closed] = 2359093
                break
        }

        return milestones
    }

    function handleProposalClick(proposal: Proposal): void {
        $selectedProposal = { ...proposal, milestones: getMilestonesFromStatus(proposal.status) }
        $governanceRouter.goTo(GovernanceRoute.Details)
    }
</script>

<proposals-container class="flex flex-col h-full">
    <header-container class="flex justify-between items-center mb-4">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposals.title')}
        </Text>
    </header-container>
    <ul class="grid grid-cols-2 gap-6 flex-1 overflow-y-scroll">
        {#each proposals as proposal}
            <proposal-box
                on:click={() => handleProposalClick(proposal)}
                class="flex flex-col p-6 border border-solid border-gray-200 rounded-xl cursor-pointer
                {proposal.status === ProposalStatus.Closed ? 'bg-transparent' : 'bg-white'}"
            >
                <div class="flex items-center gap-1.5 mb-5">
                    {#if proposal.dao}
                        <TooltipIcon
                            icon={proposal.dao.icon}
                            size="small"
                            classes="p-0.5 rounded-full bg-black text-white"
                            iconClasses="text-white"
                        >
                            <Text smaller overrideColor fontWeight={FontWeight.semibold} classes="text-gray-600"
                                >{proposal.dao.name}</Text
                            >
                        </TooltipIcon>
                    {/if}
                    <Text fontWeight={FontWeight.semibold} fontSize="14" classes="truncate">{proposal.title}</Text>
                </div>
                <div class="flex justify-between items-center">
                    <ProposalStatusInfo
                        status={proposal.status}
                        milestones={getMilestonesFromStatus(proposal.status)}
                    />
                    {#if proposal.hasVoted}
                        <TooltipIcon
                            icon={IconEnum.CheckboxRound}
                            size="small"
                            position={Position.Left}
                            iconClasses="text-black"
                        >
                            <Text smaller overrideColor fontWeight={FontWeight.semibold} classes="text-gray-600">
                                {localize('views.governance.proposals.voted')}
                            </Text>
                        </TooltipIcon>
                    {/if}
                </div>
            </proposal-box>
        {/each}
    </ul>
</proposals-container>
