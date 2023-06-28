<script lang="ts">
    import {
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
        GovernanceActivityInformation,
        NftActivityInformation,
        FoundryActivityInformation,
        TokenActivityInformation,
        ConsolidationActivityInformation,
        NftMetadataInformation,
        SmartContractActivityInformation,
    } from 'shared/components'
    import { Tab } from 'shared/components/enums'
    import { ActivityType, Activity } from '@core/wallet'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

    export let activity: Activity
    export let activeTab: Tab = Tab.Transaction

    let hasMetadata = false
    $: {
        const storedNft =
            activity?.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity?.nftId)
                : undefined
        hasMetadata = !!storedNft?.metadata
    }

    let tabs: Tab[] = []
    $: {
        switch (activity?.type) {
            case ActivityType.Basic:
                tabs = [Tab.Transaction, ...(activity?.parsedLayer2Metadata ? [Tab.SmartContract] : [])]
                break
            case ActivityType.Governance:
                tabs = [Tab.Transaction]
                break
            case ActivityType.Consolidation:
                tabs = [Tab.Transaction]
                break
            case ActivityType.Alias:
                tabs = [Tab.Transaction, Tab.Alias]
                break
            case ActivityType.Nft:
                tabs = [
                    Tab.Transaction,
                    Tab.Nft,
                    ...(hasMetadata ? [Tab.NftMetadata] : []),
                    ...(activity?.parsedLayer2Metadata ? [Tab.SmartContract] : []),
                ]
                break
            case ActivityType.Foundry:
                tabs = [Tab.Transaction, Tab.Foundry, Tab.Token]
                break
        }
    }
</script>

<activity-details class="w-full h-full space-y-2 flex flex-auto flex-col shrink-0">
    {#if tabs.length > 1}
        <Tabs bind:activeTab {tabs} />
    {/if}
    {#if activeTab === Tab.Transaction}
        {#if activity?.type === ActivityType.Governance}
            <GovernanceActivityInformation {activity} />
        {:else if activity?.type === ActivityType.Consolidation}
            <ConsolidationActivityInformation {activity} />
        {:else}
            <GenericActivityInformation {activity} />
        {/if}
    {:else if activeTab === Tab.Alias && activity?.type === ActivityType.Alias}
        <AliasActivityInformation {activity} />
    {:else if activeTab === Tab.Nft && activity?.type === ActivityType.Nft}
        <NftActivityInformation {activity} />
    {:else if activeTab === Tab.Foundry}
        <FoundryActivityInformation {activity} />
    {:else if activeTab === Tab.Token}
        <TokenActivityInformation {activity} />
    {:else if activeTab === Tab.NftMetadata && activity?.type === ActivityType.Nft}
        <NftMetadataInformation {activity} />
    {:else if activeTab === Tab.SmartContract}
        <SmartContractActivityInformation {activity} />
    {/if}
</activity-details>
