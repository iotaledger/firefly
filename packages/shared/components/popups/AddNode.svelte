<script lang="typescript">
    import { Button, Input, Password, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { isNodeUrlValid } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { Locale } from 'shared/lib/typings/i18n'

    export let locale: Locale

    export let node
    export let nodes
    export let network

    const { accounts } = get(wallet)

    export let onSuccess = (..._: any[]): void => {}

    let url = node?.url ?? ''
    let username = node?.auth?.username ?? ''
    let password = node?.auth?.password ?? ''
    let isDisabled = node?.disabled ?? false
    let isPrimary = node?.isPrimary ?? false
    let addressError = ''
    const authError = ''
    let isBusy = false

    function addCustomNode() {
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
            const validErr = isNodeUrlValid(allNodes, url, $appSettings.developerMode)
            if (validErr) {
                addressError = locale(validErr)
            }
            if (!addressError) {
                const info = await asyncGetNodeInfo($accounts[0].id, url)
                newNetworkId = info?.nodeinfo.networkId

                if (!newNetworkId) {
                    addressError = locale('error.node.networkNotReachable')
                } else if (newNetworkId !== network) {
                    addressError = locale('error.node.networkMismatch', {
                        values: {
                            networkId: newNetworkId,
                        },
                    })
                }
            }
        } catch (err) {
            showAppNotification({
                type: 'error',
                message: locale(err.error),
            })
        } finally {
            isBusy = false

            if (!addressError) {
                closePopup()

                if (onSuccess) {
                    onSuccess({
                        url,
                        auth: {
                            username,
                            password,
                        },
                        networkId: newNetworkId,
                        disabled: isDisabled,
                        isPrimary: isPrimary,
                        isCustom: true,
                    })
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
        bind:value={username}
        placeholder={locale('popups.node.optionalUsername')}
        error={authError}
        disabled={isBusy} />
    <Password classes="mt-3 mb-8" bind:value={password} placeholder={locale('popups.node.optionalPassword')} disabled={isBusy} />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.cancel')}</Button>
    <Button disabled={!url || isBusy} classes="w-1/2" onClick={() => addCustomNode()}>
        {locale(`actions.${node ? 'updateNode' : 'addNode'}`)}
    </Button>
</div>
