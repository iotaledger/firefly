<script lang="typescript">
    import { onMount } from 'svelte'
    import { Pane, Proposals, ProposalsDetails, VotingPower, Spinner } from '@ui'
    import { registeredEventIds, updateParticipationOverview } from '@contexts/governance/stores'
    import { createProposals } from '@contexts/governance/utils'

    let promise = createProposals()
    $: $registeredEventIds, (promise = createProposals())

    onMount(() => {
        void updateParticipationOverview()
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
        {#await promise}
            <Spinner busy classes="w-full h-full items-center justify-center opacity-25 h-20" width={80} height={80} />
        {:then proposals}
            <Proposals {proposals} />
        {/await}
    </div>
</div>
