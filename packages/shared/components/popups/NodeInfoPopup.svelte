<script lang="typescript">
    import { onMount } from 'svelte'
    import { Button, KeyValueBox, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, INodeInfo } from '@core/network'
    import { closePopup } from 'shared/lib/popup'
    import { showAppNotification } from 'shared/lib/notifications'
    import { setClipboard } from 'shared/lib/utils'
    import { getNodeInfo } from '@core/profile-manager'

    export let node: INode = { url: '' }

    let nodeInfo: INodeInfo
    let nodeContent = ''

    const NODE_INFO_LOCALE_BASE_PATH = 'popups.node.info'

    const NODE_INFO_KEY_MAP = {
        name: 'name',
        version: 'version',
        status: ['latestMilestone'],
        protocol: ['networkName', 'bech32HRP'],
        metrics: ['blocksPerSecond', 'referencedRate'],
        // features: 'features',
        // plugins: 'plugins',
    }

    onMount(() => {
        getNodeInfo(node?.url, node?.auth)
            .then((nodeInfoResponse) => {
                nodeInfo = nodeInfoResponse.node_info
                nodeContent = formatNodeInfo(nodeInfoResponse.url, nodeInfoResponse.node_info)
            })
            .catch((err) => {
                closePopup()
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error),
                })
            })
    })

    const formatNodeInfo = (nodeUrl: string, nodeInfo: INodeInfo): string => {
        const copyableNodeInfo = [`${localize(NODE_INFO_LOCALE_BASE_PATH + '.url')}: ${nodeUrl}`]

        Object.keys(NODE_INFO_KEY_MAP).forEach((nodeInfoKey) => {
            if (Array.isArray(NODE_INFO_KEY_MAP[nodeInfoKey])) {
                NODE_INFO_KEY_MAP[nodeInfoKey].forEach((nodeInfoSubKey) => {
                    if (nodeInfoSubKey === 'latestMilestone') {
                        copyableNodeInfo.push(
                            `${localize(NODE_INFO_LOCALE_BASE_PATH + '.' + nodeInfoKey + '.' + nodeInfoSubKey)}: ${
                                nodeInfo[nodeInfoKey][nodeInfoSubKey]?.index +
                                ' @ ' +
                                new Date(Date(nodeInfo[nodeInfoKey][nodeInfoSubKey]?.timestamp)).toLocaleString()
                            }`
                        )
                    } else {
                        copyableNodeInfo.push(
                            `${localize(NODE_INFO_LOCALE_BASE_PATH + '.' + nodeInfoKey + '.' + nodeInfoSubKey)}: ${
                                nodeInfo[nodeInfoKey][nodeInfoSubKey]
                            }`
                        )
                    }
                })
            } else {
                copyableNodeInfo.push(
                    `${localize(NODE_INFO_LOCALE_BASE_PATH + '.' + nodeInfoKey)}: ${nodeInfo[nodeInfoKey]}`
                )
            }
        })

        return copyableNodeInfo.join('\r\n')
    }

    const handleCopyNodeInfoClick = () => {
        if (!nodeContent) return

        setClipboard(nodeContent)
    }
</script>

<div class="mb-5">
    <Text type="h4" classes="mb-4">{localize('popups.node.titleInfo')}</Text>
</div>
{#if node && nodeInfo}
    <div class="info overflow-y-auto scrollable-y scroll-secondary">
        <KeyValueBox keyText={localize(`${NODE_INFO_LOCALE_BASE_PATH}.url`)} valueText={node?.url} classes="mb-4" />
        {#each Object.keys(NODE_INFO_KEY_MAP) as nodeInfoKey}
            {#if Array.isArray(NODE_INFO_KEY_MAP[nodeInfoKey])}
                {#each NODE_INFO_KEY_MAP[nodeInfoKey] as nodeInfoSubKey}
                    {#if nodeInfoSubKey === 'latestMilestone'}
                        <KeyValueBox
                            keyText={localize(`${NODE_INFO_LOCALE_BASE_PATH}.${nodeInfoKey}.${nodeInfoSubKey}`)}
                            valueText={`${nodeInfo[nodeInfoKey][nodeInfoSubKey]?.index} @ ${new Date(
                                Date(nodeInfo[nodeInfoKey][nodeInfoSubKey]?.timestamp)
                            ).toLocaleString()}`}
                            classes="mb-2.5"
                        />
                    {:else}
                        <KeyValueBox
                            keyText={localize(`${NODE_INFO_LOCALE_BASE_PATH}.${nodeInfoKey}.${nodeInfoSubKey}`)}
                            valueText={nodeInfo[nodeInfoKey][nodeInfoSubKey]}
                            classes="mb-2.5"
                        />
                    {/if}
                {/each}
            {:else if Array.isArray(nodeInfo[nodeInfoKey])}
                <KeyValueBox keyText={localize(`${NODE_INFO_LOCALE_BASE_PATH}.${nodeInfoKey}`)} classes="mb-2.5">
                    {#if nodeInfo[nodeInfoKey].length}
                        <div class="flex flex-col">
                            {#each nodeInfo[nodeInfoKey] as subItem}
                                <Text slot="value" type="p">{subItem}</Text>
                            {/each}
                        </div>
                    {:else}
                        <Text slot="value" type="p">{localize('general.none')}</Text>
                    {/if}
                </KeyValueBox>
            {:else}
                <KeyValueBox
                    keyText={localize(`${NODE_INFO_LOCALE_BASE_PATH}.${nodeInfoKey}`)}
                    valueText={nodeInfo[nodeInfoKey]}
                    classes="mb-2.5"
                />
            {/if}
        {/each}
    </div>
{:else}
    <Spinner busy message={localize('popups.node.loadingNodeInfo')} classes="justify-center" />
{/if}
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={handleCopyNodeInfoClick} disabled={!nodeInfo}>
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
