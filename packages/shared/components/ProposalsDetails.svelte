<script lang="typescript">
    import { MeatballMenuButton, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { FontWeight } from './enums'

    const counters = {
        activeProposals: 100,
        votingProposals: 3,
        votedProposals: 4,
    }

    function handleMeatballMenu(): void {
        return
    }
</script>

<proposals-details>
    <header-container class="flex justify-between items-center mb-4">
        <Text fontSize="14" fontWeight={FontWeight.semibold}>
            {localize('views.governance.proposalsDetails.title')}
        </Text>
        <MeatballMenuButton onClick={handleMeatballMenu} />
    </header-container>
    <ul class="space-y-2">
        {#each Object.keys(counters) as counterKey}
            <li class="flex justify-between bg-gray-50 px-4 py-3 rounded-lg">
                <Text fontWeight={FontWeight.medium} overrideColor classes="text-gray-600">
                    {localize(`views.governance.proposalsDetails.${counterKey}`)}
                </Text>
                <Text overrideColor classes="text-gray-600">
                    {counters[counterKey]}
                </Text>
            </li>
        {/each}
    </ul>
</proposals-details>
