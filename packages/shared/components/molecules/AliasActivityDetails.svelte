<script lang="typescript">
    import {
        AddressBox,
        ActivityInclusionStatusPill,
        Tabs,
        GenericActivityInformation,
        AliasActivityInformation,
    } from 'shared/components'
    import { AliasActivity } from '@core/wallet'

    export let activity: AliasActivity

    enum AliasTabs {
        Generic = 'general.transaction',
        Alias = 'general.alias',
    }

    const tabs = [AliasTabs.Generic, AliasTabs.Alias]
    let activeTab = AliasTabs.Generic
</script>

<alias-details class="w-full h-full space-y-6 flex flex-auto flex-col flex-shrink-0">
    <main-content class="flex flex-auto w-full flex-col items-center justify-center space-y-3">
        <alias-status class="flex flex-row w-full space-x-2 justify-center">
            <ActivityInclusionStatusPill localizationKey={'alias.creation'} inclusionState={activity.inclusionState} />
        </alias-status>
        <AddressBox clearBackground clearPadding isCopyable address={activity.aliasId} />
    </main-content>
    <Tabs bind:activeTab {tabs} />
    {#if activeTab === AliasTabs.Generic}
        <GenericActivityInformation {activity} />
    {:else}
        <AliasActivityInformation {activity} />
    {/if}
</alias-details>
