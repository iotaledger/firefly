<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, Spinner, Text } from 'shared/components'
    import { localize } from '@core/i18n'
    import { INode, INodeInfo } from '@core/network'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo } from 'shared/lib/wallet'
    import { showAppNotification } from 'shared/lib/notifications'
    import { setClipboard } from 'shared/lib/utils'
    import { cleanAuth } from '@core/network/utils'
    import { activeProfile } from '@core/profile'

    export let node: INode = { url: '' }

    let nodeContent = ''

    onMount(() => {
        asyncGetNodeInfo(accounts[0]?.id, node?.url, cleanAuth(node?.auth))
            .then((nodeInfo) => {
                nodeContent = combineNodeInfo(node?.url, nodeInfo)
            })
            .catch((err) => {
                closePopup()
                showAppNotification({
                    type: 'error',
                    message: localize(err?.error),
                })
            })
    })

    const combineNodeInfo = (nodeUrl: string, nodeInfo: INodeInfo): string => {
        const usedKeys = [
            'name',
            'networkId',
            'bech32HRP',
            'features',
            'confirmedMilestoneIndex',
            'pruningIndex',
            'messagesPerSecond',
            'referencedRate',
        ]
        return [`${localize('popups.node.info.url')}: ${nodeUrl}`]
            .concat(
                usedKeys.map((k) => {
                    let keyLocale = `popups.node.info.${k}`
                    let val
                    if (k === 'name') {
                        val = `${nodeInfo?.nodeinfo['name']} ${nodeInfo?.nodeinfo['version']}`
                        keyLocale = 'popups.node.info.software'
                    } else if (k === 'features') {
                        const hasFeatures = nodeInfo?.nodeinfo[k]?.length
                        val = hasFeatures ? nodeInfo?.nodeinfo[k]?.join(', ') : localize('general.none')
                    } else if (k === 'messagesPerSecond' || k === 'referencedRate') {
                        val = nodeInfo?.nodeinfo[k]?.toFixed(2)
                    } else {
                        val = nodeInfo?.nodeinfo[k]
                    }

                    return `${localize(keyLocale)}: ${val}`
                })
            )
            .join('\r\n')
    }

    const handleCopyNodeInfoClick = () => {
        if (!nodeContent) return

        setClipboard(nodeContent)
    }
</script>

<div class="mb-5">
    <Text type="h4">{localize('popups.node.titleInfo')}</Text>
</div>
{#if nodeContent}
    <Text type="pre" secondary>{nodeContent}</Text>
{:else}
    <Spinner busy={!nodeContent} message={localize('popups.node.loadingNodeInfo')} classes="justify-center" />
{/if}
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={handleCopyNodeInfoClick} disabled={!nodeContent}>
        {localize('actions.copy')}
    </Button>
</div>
