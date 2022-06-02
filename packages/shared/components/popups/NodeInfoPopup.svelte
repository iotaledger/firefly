<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, Checkbox, CopyableBox, KeyValueBox, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, INodeInfo } from '@core/network'
    import { closePopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { setClipboard, resolveObjectPath } from 'shared/lib/utils'
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

    $: nodeInfoTab

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
            protocolVersion: { localeKey: 'protocol.protocolVersion', nodeInfoPath: 'protocol.protocolVersion' },
            minPoWScore: { localeKey: 'protocol.minPoWScore', nodeInfoPath: 'protocol.minPoWScore' },
        },
        [NodeInfoTab.BaseToken]: {
            token: { localeKey: 'baseToken.token', nodeInfoPath: 'baseToken.token' },
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
            features: { localeKey: 'features', nodeInfoPath: 'features' },
            plugins: { localeKey: 'plugins', nodeInfoPath: 'plugins' },
        },
    }

    const NODE_INFO_LOCALE_BASE_PATH = 'popups.node.info'

    let nodeInfo: INodeInfo
    const nodeContent = ''

    function getNodeInfoValueFromPath(path: string): unknown {
        return resolveObjectPath(nodeInfo, path, null) ?? node?.url
    }

    function processNodeInfoMapTab(
        _nodeInfoTab: string,
        mapKey: string
    ): { localeKey: string; nodeInfoValue: unknown } {
        const nodeInfoTab = NODE_INFO_TAB_MAP[_nodeInfoTab]
        return {
            localeKey: nodeInfoTab[mapKey].localeKey,
            nodeInfoValue: getNodeInfoValueFromPath(nodeInfoTab[mapKey]?.nodeInfoPath),
        }
    }

    function handleNodeInfoTabClick(tab: NodeInfoTab): void {
        nodeInfoTab = tab
    }

    function handleKeyValueBoxClick(value: string): void {
        if (!value) return
        setClipboard(value)
    }

    function handleCopyAllInformationClick(): void {
        if (!nodeContent) return
        setClipboard(nodeContent)
    }

    onMount(() => {
        getNodeInfo(node?.url, node?.auth)
            .then((nodeInfoResponse) => {
                nodeInfo = nodeInfoResponse.node_info
                // nodeContent = formatNodeInfo(nodeInfoResponse.url, nodeInfoResponse.node_info)
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
    {#each Object.keys(NODE_INFO_TAB_MAP[nodeInfoTab]) as nodeInfoTabKey}
        <button
            class="w-full mb-2.5 flex flex-col"
            on:click={() =>
                handleKeyValueBoxClick(
                    String(getNodeInfoValueFromPath(NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].nodeInfoPath))
                )}
        >
            {#if typeof getNodeInfoValueFromPath(NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].nodeInfoPath) === 'boolean'}
                <KeyValueBox
                    keyText={localize(
                        `${NODE_INFO_LOCALE_BASE_PATH}.${NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].localeKey}`
                    )}
                >
                    <Checkbox
                        slot="value"
                        disabled
                        checked={getNodeInfoValueFromPath(NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].nodeInfoPath)}
                    />
                </KeyValueBox>
            {:else}
                <KeyValueBox
                    keyText={localize(
                        `${NODE_INFO_LOCALE_BASE_PATH}.${NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].localeKey}`
                    )}
                    valueText={getNodeInfoValueFromPath(NODE_INFO_TAB_MAP[nodeInfoTab][nodeInfoTabKey].nodeInfoPath)}
                />
            {/if}
        </button>
    {/each}
{:else}
    <Spinner busy message={localize('popups.node.loadingNodeInfo')} classes="justify-center" />
{/if}
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={handleCopyAllInformationClick} disabled={!nodeInfo}>
        {localize('actions.copy')}
    </Button>
</div>

<style type="text/scss">
    .info {
        max-height: 50vh;
        @screen md {
            max-height: 30vh;
        }
    }
</style>
