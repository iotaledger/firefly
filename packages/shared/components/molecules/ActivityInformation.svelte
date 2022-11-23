<script lang="typescript">
    import {
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
        NftActivityInformation,
        FoundryActivityInformation,
        TokenActivityInformation,
        NftMetadataInformation,
    } from 'shared/components'
    import { ActivityType, Activity } from '@core/wallet'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

    export let activity: Activity

    enum Tab {
        Transaction = 'general.transaction',
        Alias = 'general.alias',
        Nft = 'general.nft',
        Foundry = 'general.foundry',
        Token = 'general.token',
        NftMetadata = 'general.metadata',
    }

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
            case ActivityType.Transaction:
                tabs = [Tab.Transaction]
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

    let activeTab = Tab.Transaction
</script>

<activity-details class="w-full h-full space-y-2 flex flex-auto flex-col flex-shrink-0">
    {#if tabs.length > 1}
        <Tabs bind:activeTab {tabs} />
    {/if}
    {#if activeTab === Tab.Transaction}
        <GenericActivityInformation {activity} />
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
    {/if}
</activity-details>
