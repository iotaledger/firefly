<script lang="ts">
    import { onMount } from 'svelte'
    import { Button, Checkbox, CopyableBox, Spinner, Text } from 'shared/components'
    import { formatNumber, localize } from '@core/i18n'
    import { INode, INodeInfo } from '@core/network'
    import { closePopup } from '@auxiliary/popup'
    import { showAppNotification } from '@auxiliary/notification'
    import { resolveObjectPath, setClipboard } from '@core/utils'
    import { getNodeInfo } from '@core/profile-manager'

    enum NodeInfoTab {
        General = 'general',
        Metrics = 'metrics',
        Protocol = 'protocol',
        BaseToken = 'baseToken',
    }

    export let node: INode = { url: '' }
    export let nodeInfoTab: NodeInfoTab = NodeInfoTab.General

    const NODE_INFO_LOCALE_BASE_PATH = 'popups.node.info'
    const NODE_INFO_TAB_MAP: Readonly<{
        [key in NodeInfoTab]: { [key: string]: { localeKey: string; nodeInfoPath: string } }
    }> = {
        [NodeInfoTab.General]: {
            url: { localeKey: 'general.url', nodeInfoPath: undefined },
            name: { localeKey: 'general.name', nodeInfoPath: 'name' },
            version: { localeKey: 'general.version', nodeInfoPath: 'version' },
            pruningIndex: { localeKey: 'general.pruningIndex', nodeInfoPath: 'status.pruningIndex' },
            features: { localeKey: 'general.features', nodeInfoPath: 'features' },
        },
        [NodeInfoTab.Metrics]: {
            blocksPerSecond: { localeKey: 'metrics.blocksPerSecond', nodeInfoPath: 'metrics.blocksPerSecond' },
            referencedBlocksPerSecond: {
                localeKey: 'metrics.referencedBlocksPerSecond',
                nodeInfoPath: 'metrics.referencedBlocksPerSecond',
            },
            referencedRate: { localeKey: 'metrics.referencedRate', nodeInfoPath: 'metrics.referencedRate' },
            latestMilestone: { localeKey: 'metrics.latestMilestone', nodeInfoPath: 'status.latestMilestone.index' },
            confirmedMilestone: {
                localeKey: 'metrics.confirmedMilestone',
                nodeInfoPath: 'status.confirmedMilestone.index',
            },
        },
        [NodeInfoTab.Protocol]: {
            network: { localeKey: 'protocol.network', nodeInfoPath: 'protocol.networkName' },
            bech32Hrp: { localeKey: 'protocol.bech32Hrp', nodeInfoPath: 'protocol.bech32Hrp' },
            tokenSupply: { localeKey: 'protocol.tokenSupply', nodeInfoPath: 'protocol.tokenSupply' },
            version: { localeKey: 'protocol.version', nodeInfoPath: 'protocol.version' },
            minPowScore: { localeKey: 'protocol.minPowScore', nodeInfoPath: 'protocol.minPowScore' },
        },
        [NodeInfoTab.BaseToken]: {
            token: { localeKey: 'baseToken.token', nodeInfoPath: 'baseToken.name' },
            tickerSymbol: { localeKey: 'baseToken.tickerSymbol', nodeInfoPath: 'baseToken.tickerSymbol' },
            unit: { localeKey: 'baseToken.unit', nodeInfoPath: 'baseToken.unit' },
            subUnit: { localeKey: 'baseToken.subunit', nodeInfoPath: 'baseToken.subunit' },
            decimals: { localeKey: 'baseToken.decimals', nodeInfoPath: 'baseToken.decimals' },
            /**
             * TODO: Need a design fix.
             * See: https://cdn.discordapp.com/attachments/948228742596161577/986252727430574140/Screenshot_2022-06-14_at_14.55.24.png
             *
             * Currently, it just shows an empty checkbox and upon clicking, it just display a toast notification that it was copied, which is wrong.
             *
             * useMetricPrefix: { localeKey: 'baseToken.useMetricPrefix', nodeInfoPath: 'baseToken.useMetricPrefix' },
             */
        },
    }

    let nodeInfo: INodeInfo

    function processNodeInfoMapTab(
        _nodeInfoTab: NodeInfoTab,
        key: string
    ): { localeKey: string; nodeInfoValue: unknown } {
        const nodeInfoTabObject = NODE_INFO_TAB_MAP[_nodeInfoTab]
        const localeKey = nodeInfoTabObject[key].localeKey
        let nodeInfoValue = ''
        if (key === 'url') {
            nodeInfoValue = node.url
        } else {
            nodeInfoValue = resolveObjectPath(nodeInfo, nodeInfoTabObject[key]?.nodeInfoPath, null)
            if (key === 'referencedRate' || key === 'blocksPerSecond' || key === 'referencedBlocksPerSecond') {
                const numberValue = Number(nodeInfoValue)
                if (numberValue >= 0) {
                    if (key === 'referencedRate') {
                        nodeInfoValue = `${formatNumber(Math.min(numberValue, 100), 1, 1)}%`
                    } else {
                        nodeInfoValue = formatNumber(numberValue, 1, 1)
                    }
                } else {
                    nodeInfoValue = ''
                }
            }
        }

        return {
            localeKey,
            nodeInfoValue,
        }
    }

    function onNodeInfoTabClick(tab: NodeInfoTab): void {
        if (!tab) return
        nodeInfoTab = tab
    }

    function onCopyAllInformationClick(): void {
        if (!nodeInfo) return
        setClipboard(JSON.stringify(nodeInfo, null, '\t'))
    }

    onMount(() => {
        getNodeInfo(node?.url, node?.auth)
            .then((nodeInfoResponse) => {
                nodeInfo = nodeInfoResponse.nodeInfo
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
                <button on:click={() => onNodeInfoTabClick(_nodeInfoTab)} class="mr-3">
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
    <div class="flex flex-col space-y-2">
        {#each Object.keys(NODE_INFO_TAB_MAP[nodeInfoTab]).map( (nodeInfoTabKey) => processNodeInfoMapTab(nodeInfoTab, nodeInfoTabKey) ) as { localeKey, nodeInfoValue }}
            <CopyableBox value={nodeInfoValue}>
                <div class="w-full h-full flex flex-row justify-between items-center">
                    <Text type="p" fontSize="sm" fontWeight="font-600" secondary
                        >{localize(`${NODE_INFO_LOCALE_BASE_PATH}.${localeKey}`)}</Text
                    >
                    {#if typeof nodeInfoValue === 'boolean'}
                        <Checkbox disabled checked={nodeInfoValue} />
                    {:else if Array.isArray(nodeInfoValue)}
                        <div class="text-right w-5/6">
                            {#if nodeInfoValue.length}
                                <Text type="p" fontSize="sm" classes="w-full break-words" secondary
                                    >{nodeInfoValue.join(', ')}</Text
                                >
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
    </div>
    <div class="flex w-full justify-center pt-6">
        <Button classes="w-full" outline onClick={onCopyAllInformationClick} disabled={!nodeInfo}>
            {localize('actions.copyAllInformation')}
        </Button>
    </div>
{:else}
    <div class="my-12">
        <Spinner message={localize('popups.node.loadingNodeInfo')} />
    </div>
{/if}
