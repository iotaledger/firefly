<script lang="typescript">
    import { onMount } from 'svelte'
    import { Pane, Proposals, ProposalsDetails, VotingPower } from '@ui'
    import { getVotingEvents } from '@core/profile-manager'
    import type { IProposal } from '@core/governance/interfaces'
    import { createProposalsFromEvents } from '@core/governance/utils'

    let proposals: IProposal[]
    let loaded = false

    onMount(async () => {
        const events = await getVotingEvents()
        proposals = createProposalsFromEvents(events)
        loaded = true
    })
</script>

<div class="w-full h-full flex flex-nowrap p-8 relative flex-1 space-x-6 bg-gray-50 dark:bg-gray-900">
    <div class="w-1/3 flex flex-col space-y-4">
        <Pane classes="p-6 h-fit">
            <VotingPower />
        </Pane>
        <Pane classes="p-6 h-fit">
            <ProposalsDetails />
        </Pane>
    </div>
    <span class="block w-0.5 h-full bg-gray-200" />
    <div class="w-2/3">
        {#if loaded}
            <Proposals {proposals} />
        {/if}
    </div>
</div>
