<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Checkbox, CopyableBox, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, INodeInfo } from '@core/network'
    import { closePopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { resolveObjectPath, setClipboard } from 'shared/lib/utils'
    import { getNodeInfo } from '@core/profile-manager'

    enum NodeInfoTab {
        General = 'general',
        Protocol = 'protocol',
        BaseToken = 'baseToken',
        Metrics = 'metrics',
        Features = 'features',
    }

    export let node: INode = { url: '' }
    export let nodeInfoTab: NodeInfoTab = NodeInfoTab.General

    const NODE_INFO_LOCALE_BASE_PATH = 'popups.node.info'
    const NODE_INFO_TAB_MAP: Readonly<
        { [key in NodeInfoTab]: { [key: string]: { localeKey: string; nodeInfoPath: string } } }
    > = {
        [NodeInfoTab.General]: {
            url: { localeKey: 'general.url', nodeInfoPath: undefined },
            name: { localeKey: 'general.name', nodeInfoPath: 'name' },
            version: { localeKey: 'general.version', nodeInfoPath: 'version' },
            latestMilestone: { localeKey: 'general.latestMilestone', nodeInfoPath: 'status.latestMilestone.index' },
            confirmedMilestone: {
                localeKey: 'general.confirmedMilestone',
                nodeInfoPath: 'status.confirmedMilestone.index',
            },
            pruningIndex: { localeKey: 'general.pruningIndex', nodeInfoPath: 'status.pruningIndex' },
        },
        [NodeInfoTab.Protocol]: {
            network: { localeKey: 'protocol.network', nodeInfoPath: 'protocol.networkName' },
            bech32HRP: { localeKey: 'protocol.bech32HRP', nodeInfoPath: 'protocol.bech32HRP' },
            tokenSupply: { localeKey: 'protocol.tokenSupply', nodeInfoPath: 'protocol.tokenSupply' },
            protocolVersion: { localeKey: 'protocol.protocolVersion', nodeInfoPath: 'protocol.version' },
            minPoWScore: { localeKey: 'protocol.minPoWScore', nodeInfoPath: 'protocol.minPoWScore' },
        },
        [NodeInfoTab.BaseToken]: {
            token: { localeKey: 'baseToken.token', nodeInfoPath: 'baseToken.name' },
            tickerSymbol: { localeKey: 'baseToken.tickerSymbol', nodeInfoPath: 'baseToken.tickerSymbol' },
            unit: { localeKey: 'baseToken.unit', nodeInfoPath: 'baseToken.unit' },
            subUnit: { localeKey: 'baseToken.subunit', nodeInfoPath: 'baseToken.subunit' },
            decimals: { localeKey: 'baseToken.decimals', nodeInfoPath: 'baseToken.decimals' },
            useMetricPrefix: { localeKey: 'baseToken.useMetricPrefix', nodeInfoPath: 'baseToken.useMetricPrefix' },
        },
        [NodeInfoTab.Metrics]: {
            blocksPerSecond: { localeKey: 'metrics.blocksPerSecond', nodeInfoPath: 'metrics.blocksPerSecond' },
            referencedBlocksPerSecond: {
                localeKey: 'metrics.referencedBlocksPerSecond',
                nodeInfoPath: 'metrics.referencedBlocksPerSecond',
            },
            referencedRate: { localeKey: 'metrics.referencedRate', nodeInfoPath: 'metrics.referencedRate' },
        },
        [NodeInfoTab.Features]: {
            features: { localeKey: 'features.features', nodeInfoPath: 'features' },
            plugins: { localeKey: 'features.plugins', nodeInfoPath: 'plugins' },
        },
    }

    let nodeInfo: INodeInfo

    function processNodeInfoMapTab(
        _nodeInfoTab: NodeInfoTab,
        key: string
    ): { localeKey: string; nodeInfoValue: unknown } {
        const nodeInfoTabObject = NODE_INFO_TAB_MAP[_nodeInfoTab]
        const localeKey = nodeInfoTabObject[key].localeKey
        const nodeInfoValue =
            key !== 'url' ? resolveObjectPath(nodeInfo, nodeInfoTabObject[key]?.nodeInfoPath, null) : node?.url

        return {
            localeKey,
            nodeInfoValue,
        }
    }

    function handleNodeInfoTabClick(tab: NodeInfoTab): void {
        if (!tab) return
        nodeInfoTab = tab
    }

    function handleKeyValueBoxClick(value: string): void {
        if (!value) return
        setClipboard(value)
    }

    function handleCopyAllInformationClick(): void {
        if (!nodeInfo) return
        setClipboard(JSON.stringify(nodeInfo, null, '\t'))
    }

    onMount(() => {
        getNodeInfo(node?.url, node?.auth)
            .then((nodeInfoResponse) => {
                nodeInfo = nodeInfoResponse.node_info
            })
            .catch((err) => {
                closePopup()
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error),
                })
            })
    })
</script>

<div class="mb-5">
    <Text type="h4" classes="mb-4">{localize('popups.node.titleInfo')}</Text>
</div>
{#if nodeInfo && nodeInfoTab}
    <div class="mb-4 flex flex-row">
        {#key nodeInfoTab}
            {#each Object.values(NodeInfoTab) as _nodeInfoTab}
                <button on:click={() => handleNodeInfoTabClick(_nodeInfoTab)} class="mr-3">
                    <Text
                        fontSize="sm"
                        classes="font-11 hover:text-blue-500"
                        highlighted={_nodeInfoTab === nodeInfoTab}
                    >
                        {localize(`${NODE_INFO_LOCALE_BASE_PATH}.${_nodeInfoTab}.tab`)}
                    </Text>
                </button>
            {/each}
        {/key}
    </div>
    {#each Object.keys(NODE_INFO_TAB_MAP[nodeInfoTab]).map( (nodeInfoTabKey) => processNodeInfoMapTab(nodeInfoTab, nodeInfoTabKey) ) as { localeKey, nodeInfoValue }}
        <CopyableBox value={nodeInfoValue} classes="mb-2.5">
            <div class="w-full h-full flex flex-row justify-between items-center">
                <Text type="p" fontSize="sm" fontWeight="font-600" secondary
                    >{localize(`${NODE_INFO_LOCALE_BASE_PATH}.${localeKey}`)}</Text
                >
                {#if typeof nodeInfoValue === 'boolean'}
                    <Checkbox disabled checked={nodeInfoValue} />
                {:else if Array.isArray(nodeInfoValue)}
                    <div class="flex flex-col text-right">
                        {#if nodeInfoValue.length}
                            {#each nodeInfoValue as item}
                                <Text type="p" fontSize="sm" secondary>{item}</Text>
                            {/each}
                        {:else}
                            <Text type="p" fontSize="sm" secondary>{localize('general.none')}</Text>
                        {/if}
                    </div>
                {:else}
                    <Text type="p" fontSize="sm" secondary>{nodeInfoValue}</Text>
                {/if}
            </div>
        </CopyableBox>
    {/each}
    <div class="flex w-full justify-center pt-8">
        <Button classes="w-full" secondary onClick={handleCopyAllInformationClick} disabled={!nodeInfo}>
            {localize('actions.copyAllInformation')}
        </Button>
    </div>
{:else}
    <Spinner busy message={localize('popups.node.loadingNodeInfo')} classes="my-12 justify-center" />
{/if}

<style type="text/scss">
    .info {
        max-height: 50vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>
