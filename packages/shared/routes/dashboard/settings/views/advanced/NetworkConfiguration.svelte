<script lang="typescript">
    import { localize } from '@core/i18n'
    import {
        addOfficialNodesToClientOptions,
        NetworkHealth,
        networkStatus,
        NetworkStatusDescription,
        NetworkType,
        NETWORK_HEALTH_COLORS,
        nodeInfo,
        toggleLocalPowInClientOptions,
    } from '@core/network'
    import { activeProfile } from '@core/profile'
    import { closePopup, openPopup } from '@lib/popup'
    import { Button, Checkbox, HR, Text, NodeListTable } from 'shared/components'

    let nodesContainer: HTMLElement

    const { networkType } = $activeProfile
    $: clientOptions = $activeProfile?.clientOptions

    function handleAddNodeClick(): void {
        openPopup({
            type: 'addNode',
            props: {
                onSuccess: () => {
                    closePopup()
                    setTimeout(() => {
                        /**
                         * NOTE: This automatically scrolls the user to the bottom of the
                         * nodes container to see the newly added node.
                         */
                        nodesContainer.scrollTop = nodesContainer.scrollHeight
                    }, 100)
                },
            },
        })
    }
</script>

<div>
    <Text type="h4" classes="mb-3">{localize('views.settings.networkConfiguration.title2')}</Text>
    <Text type="p" secondary classes="mb-3">
        {localize(
            `views.settings.networkConfiguration.description.${$activeProfile?.isDeveloperProfile ? 'dev' : 'nonDev'}`
        )}
    </Text>
    <div class="flex flex-row justify-between w-3/4">
        <div>
            <Text type="p" classes="inline" secondary>
                {localize('views.settings.networkConfiguration.connectedTo')}:
            </Text>
            <Text type="p" highlighted>{$nodeInfo?.protocol?.networkName}</Text>
        </div>
        <div>
            <Text type="p" classes="inline" secondary>{localize('views.dashboard.network.status')}:</Text>
            <div>
                <p class="text-13 text-{NETWORK_HEALTH_COLORS[$networkStatus.health || 0]}-500">
                    {localize(
                        `views.dashboard.network.${
                            $networkStatus.description || NetworkStatusDescription[NetworkHealth.Disconnected]
                        }`
                    )}
                </p>
            </div>
        </div>
    </div>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="configureNodeList">
        <Text type="h5" classes="mb-3">{localize('views.settings.configureNodeList.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.settings.configureNodeList.description')}</Text>
        <NodeListTable bind:nodesContainer />
        <div class="flex flex-row justify-between space-x-3 w-full mt-4">
            {#if networkType !== NetworkType.PrivateNet}
                <Button
                    outline
                    inlineStyle="min-width: 156px;"
                    classes="w-1/2"
                    onClick={addOfficialNodesToClientOptions}
                >
                    {localize('actions.addOfficialNodes')}
                </Button>
            {/if}
            <Button
                inlineStyle="min-width: 156px;"
                classes={networkType === NetworkType.PrivateNet ? '' : 'w-1/2'}
                onClick={handleAddNodeClick}
            >
                {localize('actions.addNode')}
            </Button>
        </div>
    </section>
    <HR classes="pb-5 mt-5 justify-center" />
    <section id="proofOfWork">
        <Text type="h5" classes="mb-3">{localize('views.settings.proofOfWork.title')}</Text>
        <Text type="p" secondary classes="mb-5">{localize('views.settings.proofOfWork.description')}</Text>
        <Checkbox
            label={localize('actions.localProofOfWork')}
            checked={clientOptions?.localPow}
            onClick={toggleLocalPowInClientOptions}
        />
    </section>
</div>
