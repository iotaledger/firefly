<script lang="typescript">
    import {
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
        NftActivityInformation,
        FoundryActivityInformation,
    } from 'shared/components'
    import { ActivityType, Activity } from '@core/wallet'

    export let activity: Activity

    enum Tab {
        Transaction = 'general.transaction',
        Alias = 'general.alias',
        Nft = 'general.nft',
        Foundry = 'general.foundry',
    }

    let tabs: Tab[] = []
    switch (activity.type) {
        case ActivityType.Basic:
            tabs = [Tab.Transaction]
            break
        case ActivityType.Alias:
            tabs = [Tab.Transaction, Tab.Alias]
            break
        case ActivityType.Nft:
            tabs = [Tab.Transaction, Tab.Nft]
            break
        case ActivityType.Foundry:
            tabs = [Tab.Transaction, Tab.Foundry]
            break
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
    {:else if activeTab === Tab.Foundry}
        <FoundryActivityInformation {activity} />
    {/if}
</activity-details>
