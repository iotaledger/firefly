<script lang="typescript">
    import { Button, Input, Password, Text } from 'shared/components'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { isNodeUrlValid } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    
    export let locale
    export let onSuccess
    export let node
    export let nodes

    let url = node?.url ?? ''
    let username = node?.auth?.username ?? ''
    let password = node?.auth?.password ?? ''
    let addressError = ''
    const authError = ''
    let isBusy = false

    async function addCustomNode() {
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
            const validErr = isNodeUrlValid(allNodes, url)
            if (validErr) {
                addressError = locale(validErr)
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
                            password
                        }
                    })
                }
            }
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale(`popups.node.title${node ? 'Update' : 'Add'}`)}</Text>
<div class="w-full h-full">
    <Input bind:value={url} placeholder={locale('popups.node.nodeAddress')} error={addressError} disabled={isBusy} autofocus />
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
