<script lang="ts">
    import { Pane, Proposals, ProposalsDetails, VotingPower, Illustration, Text, FontWeight } from '@ui'
    import { localize } from '@core/i18n'
    import { registeredProposalsForSelectedAccount } from '@contexts/governance'
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
    <span class="block w-0.5 h-full bg-gray-200 dark:bg-gray-800" />
    <div class="w-2/3">
        {#if Object.keys($registeredProposalsForSelectedAccount).length}
            <Proposals />
        {:else}
            <div class="w-full h-full flex flex-col items-center justify-center">
                <Illustration illustration="empty-collectibles" width="134" height="134" />
                <Text fontSize="text-14" fontWeight={FontWeight.semibold} color="gray-500" classes="mt-8"
                    >{localize('views.governance.proposals.emptyTitle')}</Text
                >
            </div>
        {/if}
    </div>
</div>
