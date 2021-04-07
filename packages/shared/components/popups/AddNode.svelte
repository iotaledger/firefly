<script lang="typescript">
    import { Button, Input, Password, Text } from 'shared/components'
    import { appSettings } from 'shared/lib/appSettings'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { getNodeNetworkInfo, isNodeUrlValid } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'

    export let locale
    export let onSuccess
    export let node
    export let nodes
    export let network

    let url = node?.url ?? ''
    let username = node?.auth?.username ?? ''
    let password = node?.auth?.password ?? ''
    let isDisabled = node?.disabled ?? false
    let isPrimary = node?.isPrimary ?? false
    let addressError = ''
    let addressWarn = ''
    let authError = ''
    let isBusy = false

    $:{
        addressWarn = ''
        url = stripSpaces(url)
        if ($appSettings.developerMode && url.length > 4 && url.startsWith("http:")) {
            addressWarn = locale('popups.node.httpWarning')
        }
    }

    async function addCustomNode() {
        let newNetworkId
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
                const info = await getNodeNetworkInfo(url)
                newNetworkId = info?.networkId

                if (!newNetworkId) {
                    addressError = locale('error.node.networkNotReachable')
                } else if (newNetworkId !== network) {
                    addressError = locale('error.node.networkMismatch', { 
                        values: {
                            networkId: newNetworkId
                        } 
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
