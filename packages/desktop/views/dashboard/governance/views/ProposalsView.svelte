<script lang="typescript">
    import { onMount } from 'svelte'
    import { Pane, Proposals, ProposalsDetails, VotingPower } from '@ui'
    import type { IProposal } from '@contexts/governance/interfaces'
    import { registeredEventIds, updateParticipationOverview } from '@contexts/governance/stores'
    import { createProposals } from '@contexts/governance/utils'

    let proposals: IProposal[]
    let loaded = false

    $: $registeredEventIds, void setProposals()

    async function setProposals(): Promise<void> {
        proposals = await createProposals()
    }

    async function onMountHelper(): Promise<void> {
        await updateParticipationOverview()
        await setProposals()
        loaded = true
    }

    onMount(() => {
        void onMountHelper()
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
