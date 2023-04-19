<script lang="ts">
    import { NodeListTable } from '@components'
    import { Button, HR, Text, TextType } from '@ui'
    import { localize } from '@core/i18n'
    import {
        addOfficialNodesToClientOptions,
        INode,
        NETWORK_HEALTH_COLORS,
        NetworkHealth,
        networkStatus,
        NetworkId,
        nodeInfo,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { NetworkInformationSettingsAction } from '@/contexts/settings'
    import { networkInformationSettingsRouter } from '@/routers'

    $: networkId = $activeProfile?.network?.id

    function onAddNodeClick(): void {
        $networkInformationSettingsRouter.next({ action: NetworkInformationSettingsAction.AddNode })
    }

    function onNodeClick(node: INode) {
        $networkInformationSettingsRouter.next({ node })
    }
</script>

<network-configuration-init-view class="flex flex-col justify-between space-y-4 h-full">
    <div class="flex flex-col space-y-4">
        <div class="flex flex-row justify-between space-x-2">
            <div>
                <Text type={TextType.p} classes="inline" secondary>
                    {localize('views.settings.networkInformation.connectedTo')}:
                </Text>
                <Text type={TextType.p} highlighted>{$nodeInfo?.protocol?.networkName}</Text>
            </div>
            <div>
                <Text type={TextType.p} classes="inline" secondary>{localize('views.dashboard.network.status')}:</Text>
                <div>
                    <p
                        class="text-13 text-{NETWORK_HEALTH_COLORS[
                            $networkStatus.health ?? NetworkHealth.Disconnected
                        ]}-500"
                    >
                        {localize(`views.dashboard.network.${$networkStatus.health ?? NetworkHealth.Disconnected}`)}
                    </p>
                </div>
            </div>
        </div>
        <HR />
        <div class="flex flex-col space-y-4 w-full">
            <Text type={TextType.h5}>{localize('views.settings.configureNodeList.title')}</Text>
            <Text type={TextType.p} secondary>{localize('views.settings.configureNodeList.description')}</Text>
            <NodeListTable {onNodeClick} />
        </div>
    </div>
    <div class="flex flex-col space-y-4 w-full">
        {#if networkId !== NetworkId.Custom}
            <Button outline classes="w-full" onClick={addOfficialNodesToClientOptions}>
                {localize('actions.addOfficialNodes')}
            </Button>
        {/if}
        <Button inlineStyle="min-width: 156px;" classes="w-full" onClick={onAddNodeClick}>
            {localize('actions.addNode')}
        </Button>
    </div>
</network-configuration-init-view>
