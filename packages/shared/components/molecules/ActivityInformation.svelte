<script lang="typescript">
    import {
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
        NftActivityInformation,
        FoundryActivityInformation,
        TokenActivityInformation,
        NftMetadataInformation,
        SmartContractActivityInformation,
    } from 'shared/components'
    import { Tab } from 'shared/components/enums'
    import { ActivityType, Activity } from '@core/wallet'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

    export let activity: Activity
    export let networkAddress: string = null
    export let activeTab = Tab.Transaction

    let hasMetadata = false
    $: {
        const storedNft =
            activity.type === ActivityType.Nft
                ? getNftByIdFromAllAccountNfts($selectedAccountIndex, activity.nftId)
                : undefined
        hasMetadata = !!storedNft?.metadata
    }

    let tabs: Tab[] = []
    $: {
        switch (activity.type) {
            case ActivityType.Basic:
                tabs = [Tab.Transaction, ...(activity?.parsedLayer2Metadata ? [Tab.SmartContract] : [])]
                break
            case ActivityType.Alias:
                tabs = [Tab.Transaction, Tab.Alias]
                break
            case ActivityType.Nft:
                tabs = [Tab.Transaction, Tab.Nft, ...(hasMetadata ? [Tab.NftMetadata] : [])]
                break
            case ActivityType.Foundry:
                tabs = [Tab.Transaction, Tab.Foundry, Tab.Token]
                break
        }
    }
</script>

<activity-details class="w-full h-full space-y-2 flex flex-auto flex-col flex-shrink-0">
    {#if tabs.length > 1}
        <Tabs bind:activeTab {tabs} />
    {/if}
    {#if activeTab === Tab.Transaction}
        <GenericActivityInformation {activity} {networkAddress} />
    {:else if activeTab === Tab.Alias && activity.type === ActivityType.Alias}
        <AliasActivityInformation {activity} />
    {:else if activeTab === Tab.Nft && activity.type === ActivityType.Nft}
        <NftActivityInformation {activity} />
    {:else if activeTab === Tab.Foundry}
        <FoundryActivityInformation {activity} />
    {:else if activeTab === Tab.Token}
        <TokenActivityInformation {activity} />
    {:else if activeTab === Tab.NftMetadata && activity.type === ActivityType.Nft}
        <NftMetadataInformation {activity} />
    {:else if activeTab === Tab.SmartContract}
        <SmartContractActivityInformation {activity} />
    {/if}
</activity-details>
