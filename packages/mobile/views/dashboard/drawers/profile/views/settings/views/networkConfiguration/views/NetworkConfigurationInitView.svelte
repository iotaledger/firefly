<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        addOfficialNodesToClientOptions,
        INode,
        NetworkHealth,
        networkStatus,
        NetworkType,
        NETWORK_HEALTH_COLORS,
        NETWORK_STATUS_DESCRIPTION,
        nodeInfo,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { Button, HR, Text, TextType } from '@ui'
    import { NodeListTable } from '@components'
    import { NetworkConfigurationSettingsAction } from '@/contexts/settings'
    import { networkConfigurationSettingsRouter } from '../../../../../../../../../lib/routers'

    const { networkType } = $activeProfile

    function handleAddNodeClick(): void {
        $networkConfigurationSettingsRouter.next({ action: NetworkConfigurationSettingsAction.AddNode })
    }

    function handleNodeClick(node: INode) {
        $networkConfigurationSettingsRouter.next({ node })
    }
</script>

<div class="flex flex-col justify-between space-y-4 h-full">
    <div class="flex flex-col space-y-4">
        <Text type={TextType.p} secondary classes="mb-3">
            {localize(
                `views.settings.networkConfiguration.description.${
                    $activeProfile?.isDeveloperProfile ? 'dev' : 'nonDev'
                }`
            )}
        </Text>
        <div class="flex flex-row justify-between space-x-2">
            <div>
                <Text type={TextType.p} classes="inline" secondary>
                    {localize('views.settings.networkConfiguration.connectedTo')}:
                </Text>
                <Text type={TextType.p} highlighted>{$nodeInfo?.protocol?.networkName}</Text>
            </div>
            <div>
                <Text type={TextType.p} classes="inline" secondary>{localize('views.dashboard.network.status')}:</Text>
                <div>
                    <p class="text-13 text-{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                        {localize(
                            `views.dashboard.network.${
                                $networkStatus.description || NETWORK_STATUS_DESCRIPTION[NetworkHealth.Disconnected]
                            }`
                        )}
                    </p>
                </div>
            </div>
        </div>
        <HR />
        <div class="flex flex-col space-y-4 w-full">
            <Text type={TextType.h5}>{localize('views.settings.configureNodeList.title')}</Text>
            <Text type={TextType.p} secondary>{localize('views.settings.configureNodeList.description')}</Text>
            <NodeListTable onNodeClick={handleNodeClick} />
        </div>
    </div>
    <div class="flex flex-col space-y-4 w-full">
        {#if networkType !== NetworkType.PrivateNet}
            <Button outline classes="w-full" onClick={addOfficialNodesToClientOptions}>
                {localize('actions.addOfficialNodes')}
            </Button>
        {/if}
        <Button inlineStyle="min-width: 156px;" classes="w-full" onClick={handleAddNodeClick}>
            {localize('actions.addNode')}
        </Button>
    </div>
</div>
