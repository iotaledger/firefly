<script lang="typescript">
    import { Button, Checkbox, Input, Password, Text } from 'shared/components'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { getNetworkById, getOfficialNodes, isNodeUrlValid, updateClientOptions } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo, wallet } from 'shared/lib/wallet'
    import { Locale } from 'shared/lib/typings/i18n'
    import { Node, NodeInfo } from '../../lib/typings/node'
    import { Network } from 'shared/lib/typings/network'
    import { activeProfile, updateProfile } from 'shared/lib/profile'

    export let locale: Locale

    export let node: Node
    export let nodes: Node[]
    export let network: Network

    export let onSuccess = (..._: any[]): void => {}

    const { accounts } = $wallet

    let url = node?.url ?? ''
    const auth = node?.auth ?? { password: '', username: '' }
    const isDisabled = node?.isDisabled ?? false
    let isPrimary = node?.isPrimary ?? false
    let addressError = ''
    let addressWarn = ''
    const authError = ''
    let isBusy = false
    let isSuccess = true
    let shouldSwitchNetworks = false

    $: {
        addressWarn = ''
        url = stripSpaces(url)
        if (!$activeProfile.isDeveloperProfile && /^http:\/\//.exec(url)) {
            addressWarn = locale('warning.node.http')
        }
    }

    async function addCustomNode() {
        let newNetworkId
        let nodeInfo: NodeInfo

        try {
            isBusy = true
            addressError = ''

            url = stripSpaces(url)
            url = stripTrailingSlash(url)

            let allNodes = nodes ?? []
            // If this is an update not an add then remove the current node from the list
            // before checking for dupes
            if (node) {
                allNodes = allNodes.filter((n) => n.url !== node.url)
            }
            const validErr = isNodeUrlValid(allNodes, url, $activeProfile.isDeveloperProfile)
            if (validErr) {
                addressError = locale(validErr)
            }
            if (!addressError) {
                /**
                 * CAUTION: If the JSON web token data field is empty but still there, it likely
                 * will throw an error when trying to connect with the node.
                 */
                const _auth = auth.jwt ? auth : { username: auth.username, password: auth.password }

                nodeInfo = await asyncGetNodeInfo($accounts[0].id, url, _auth)
                newNetworkId = nodeInfo?.nodeinfo.networkId

                if (!newNetworkId) {
                    addressError = locale('error.network.notReachable')
                } else if (newNetworkId !== network.id) {
                    if(nodes.length !== 0 || !$activeProfile.isDeveloperProfile) {
                        addressError = locale('error.network.mismatch', {
                            values: {
                                networkId: newNetworkId,
                            },
                        })
                    } else {
                        shouldSwitchNetworks = true
                    }
                }
            }
        } catch (err) {
            isSuccess = false

            showAppNotification({
                type: 'error',
                message: locale(err?.error),
            })
        } finally {
            isBusy = false

            if (!addressError) {
                if (isSuccess && onSuccess) {
                    const network = shouldSwitchNetworks
                        ? getNetworkById(nodeInfo.nodeinfo.networkId)
                        : $activeProfile.settings.networkConfig.network

                    onSuccess(shouldSwitchNetworks, {
                        url,
                        auth,
                        network,
                        isDisabled,
                        isPrimary,
                    })
                    closePopup()
                }
            }
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale(`popups.node.title${node ? 'Update' : 'Add'}`)}</Text>
<div class="w-full h-full">
    <Input bind:value={url} placeholder={locale('popups.node.nodeAddress')} error={addressError} disabled={isBusy} autofocus />
    {#if addressWarn}
        <Text overrideColor classes="text-orange-500 mt-2">{addressWarn}</Text>
    {/if}
    <Input
        classes="mt-3"
        bind:value={auth.username}
        placeholder={locale('popups.node.optionalUsername')}
        error={authError}
        disabled={isBusy} />
    <Password classes="mt-3" bind:value={auth.password} placeholder={locale('popups.node.optionalPassword')} disabled={isBusy} />
    <Password classes="mt-3" bind:value={auth.jwt} label placeholder={locale('popups.node.optionalJwt')} disabled={isBusy} />
    <Checkbox label={locale('popups.node.setAsPrimaryNode')} bind:checked={isPrimary} classes="mt-4 mb-8" />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.cancel')}</Button>
    <Button disabled={!url || isBusy} classes="w-1/2" onClick={() => addCustomNode()}>
        {locale(`actions.${node ? 'updateNode' : 'addNode'}`)}
    </Button>
</div>
