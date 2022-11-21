<script lang="typescript">
    import {
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
        NftActivityInformation,
    } from 'shared/components'
    import { ActivityType, Activity, NftActivity } from '@core/wallet'
    import NftMetadataInformation from './activity-info/NftMetadataInformation.svelte'
    import { getNftByIdFromAllAccountNfts } from '@core/nfts'
    import { selectedAccountIndex } from '@core/account'

    export let activity: Partial<Activity> = {}

    enum Tab {
        Transaction = 'general.transaction',
        Alias = 'general.alias',
        Nft = 'general.nft',
        Metadata = 'general.metadata',
    }

    let hasMetadata = false
    $: {
        const storedNft = getNftByIdFromAllAccountNfts($selectedAccountIndex, (activity as NftActivity)?.nftId)
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
                tabs = [Tab.Transaction, Tab.Nft, ...(hasMetadata ? [Tab.Metadata] : [])]
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
    {:else if activeTab === Tab.Alias}
        <AliasActivityInformation {activity} />
    {:else if activeTab === Tab.Nft}
        <NftActivityInformation {activity} />
    {:else if activeTab === Tab.Metadata}
        <NftMetadataInformation {activity} />
    {/if}
</activity-details>
