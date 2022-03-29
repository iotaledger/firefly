<script lang="typescript">
    import { onMount } from 'svelte'
    import { get } from 'svelte/store'
    import { Button, Spinner, Text } from 'shared/components'
    import { Locale } from '@core/i18n'
    import { Node, NodeInfo } from 'shared/lib/typings/node'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo, wallet } from 'shared/lib/wallet'
    import { showAppNotification } from 'shared/lib/notifications'
    import { setClipboard } from 'shared/lib/utils'
    import { cleanNodeAuth } from 'shared/lib/network'

    export let locale: Locale
    export let node: Node = { url: '' }

    let nodeContent = ''

    onMount(() => {
        const accounts = get($wallet.accounts)
        asyncGetNodeInfo(accounts[0]?.id, node?.url, cleanNodeAuth(node?.auth))
            .then((nodeInfo) => {
                nodeContent = combineNodeInfo(node?.url, nodeInfo)
            })
            .catch((err) => {
                closePopup()
                showAppNotification({
                    type: 'error',
                    message: locale(err?.error),
                })
            })
    })

    const combineNodeInfo = (nodeUrl: string, nodeInfo: NodeInfo): string => {
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
        return [`${locale('popups.node.info.url')}: ${nodeUrl}`]
            .concat(
                usedKeys.map((k) => {
                    let keyLocale = `popups.node.info.${k}`
                    let val
                    if (k === 'name') {
                        val = `${nodeInfo?.nodeinfo['name']} ${nodeInfo?.nodeinfo['version']}`
                        keyLocale = 'popups.node.info.software'
                    } else if (k === 'features') {
                        const hasFeatures = nodeInfo?.nodeinfo[k]?.length
                        val = hasFeatures ? nodeInfo?.nodeinfo[k]?.join(', ') : locale('general.none')
                    } else if (k === 'messagesPerSecond' || k === 'referencedRate') {
                        val = nodeInfo?.nodeinfo[k]?.toFixed(2)
                    } else {
                        val = nodeInfo?.nodeinfo[k]
                    }

                    return `${locale(keyLocale)}: ${val}`
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
    <Text type="h4">{locale('popups.node.titleInfo')}</Text>
</div>
{#if nodeContent}
    <Text type="pre" secondary>{nodeContent}</Text>
{:else}
    <Spinner busy={!nodeContent} message={locale('popups.node.loadingNodeInfo')} classes="justify-center" />
{/if}
<div class="flex w-full justify-center pt-8">
    <Button classes="w-1/2" onClick={handleCopyNodeInfoClick} disabled={!nodeContent}>
        {locale('actions.copy')}
    </Button>
</div>
