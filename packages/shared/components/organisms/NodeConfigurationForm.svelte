<script lang="typescript">
    import { Checkbox, Input, Password, Text, Button, Spinner } from 'shared/components'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { IAuth, INode, INetwork, INodeInfoResponse, NETWORK, BASE_TOKEN, NetworkProtocol } from '@core/network'
    import { getNetwork, checkNodeUrlValidity, cleanAuth } from '@core/network/utils'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { getNodeInfo } from '@core/profile-manager'
    import { activeProfile, newProfile } from '@core/profile'
    import { getNetworkStatusFromNodeInfo } from '@core/network/helpers'
    import { localize } from '@core/i18n'

    export let hideButtons = false
    export let hideCheckbox = false
    export let isAddingNode = true
    export let node: INode = { url: '', isPrimary: false }
    export let nodes: INode[] = []
    export let network: INetwork
    export let onSuccess = (..._: any[]): void => {}
    export let nodeUrl: string = node?.url || ''
    export let isBusy = false

    const oldNodeUrl: string = nodeUrl
    const optNodeAuth: IAuth = node?.auth || { username: '', password: '', jwt: '' }
    const authError = ''

    let addressError = ''
    let addressWarn = ''
    let newNetwork: INetwork

    $: nodeUrl, (addressError = '')
    $: {
        addressWarn = ''
        node.url = stripSpaces(node.url)
        if (!$activeProfile?.isDeveloperProfile && /^http:\/\//.exec(node.url)) {
            addressWarn = localize('warning.node.http')
        }
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))

    function constructNodes(): INode[] {
        return node ? nodes.filter((n) => cleanNodeUrl(node.url) !== cleanNodeUrl(n.url)) : nodes
    }

    function cleanNodeFormData(): void {
        const _nodes = constructNodes()
        const validErr = checkNodeUrlValidity(_nodes, cleanNodeUrl(nodeUrl), $activeProfile.isDeveloperProfile)
        if (validErr) {
            addressError = localize(validErr)
        }
    }

    function checkNetworkId(id: string): void {
        if (!id) {
            addressError = localize('error.network.notReachable')
        } else if (id !== network?.id) {
            if ($activeProfile?.isDeveloperProfile || $newProfile?.isDeveloperProfile) {
                newNetwork = getNetwork($activeProfile.networkProtocol, $activeProfile.networkType, id)
            } else {
                addressError = localize('error.network.mismatch', { values: { networkId: id } })
            }
        }
    }

    export async function handleAddNodeClick(): Promise<void> {
        isBusy = true
        addressError = ''

        let nodeInfo: INodeInfoResponse

        try {
            if (node) {
                cleanNodeFormData()

                if (!addressError) {
                    nodeInfo = await getNodeInfo(cleanNodeUrl(nodeUrl), cleanAuth(optNodeAuth))
                    checkNetworkId(nodeInfo?.nodeinfo?.protocol?.networkName)
                }
            }
        } catch (err) {
            isBusy = false

            showAppNotification({
                type: 'error',
                message: localize(err?.error),
            })

            return
        }

        if (!addressError) {
            const networkStatus = getNetworkStatusFromNodeInfo(nodeInfo?.nodeinfo)
            const baseToken = nodeInfo?.nodeinfo?.baseToken
            const protocol = Object.keys(BASE_TOKEN).find(
                (key) => BASE_TOKEN[key]?.name === baseToken?.name
            ) as NetworkProtocol

            if (networkStatus) {
                isBusy = false
                onSuccess(
                    false,
                    {
                        url: cleanNodeUrl(nodeUrl),
                        auth: optNodeAuth,
                        network: getNetwork(
                            protocol ?? $activeProfile.networkProtocol,
                            $activeProfile.networkType,
                            nodeInfo?.nodeinfo?.protocol?.networkName
                        ),
                        isPrimary: node?.isPrimary || false,
                    },
                    oldNodeUrl
                )
                closePopup()
            }
        }

        isBusy = false
        return
    }
</script>

<form id="node-config-form" class="w-full h-full">
    <Input
        bind:value={nodeUrl}
        placeholder={localize('popups.node.nodeAddress')}
        error={addressError}
        disabled={isBusy}
        autofocus
    />
    {#if addressWarn}
        <Text overrideColor classes="text-orange-500 mt-2">{addressWarn}</Text>
    {/if}
    <Input
        classes="mt-3"
        bind:value={optNodeAuth.username}
        placeholder={localize('popups.node.optionalUsername')}
        error={authError}
        disabled={isBusy}
    />
    <Password
        classes="mt-3"
        bind:value={optNodeAuth.password}
        placeholder={localize('popups.node.optionalPassword')}
        disabled={isBusy}
    />
    <Password
        classes="mt-3"
        bind:value={optNodeAuth.jwt}
        placeholder={localize('popups.node.optionalJwt')}
        disabled={isBusy}
    />
    {#if !hideCheckbox}
        <Checkbox
            label={localize('popups.node.setAsPrimaryNode')}
            bind:checked={node.isPrimary}
            disabled={isBusy}
            classes="mt-4 mb-8"
        />
    {/if}
</form>
{#if !hideButtons}
    <div class="flex flex-row justify-between space-x-4 w-full">
        <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>
            {localize('actions.cancel')}
        </Button>
        <Button
            disabled={!nodeUrl || isBusy}
            type="submit"
            form="node-config-form"
            classes="w-1/2"
            onClick={handleAddNodeClick}
        >
            {#if isBusy}
                <Spinner
                    busy={isBusy}
                    message={localize(`popups.node.${isAddingNode ? 'addingNode' : 'updatingNode'}`)}
                    classes="justify-center"
                />
            {:else}
                {localize(`actions.${isAddingNode ? 'addNode' : 'updateNode'}`)}
            {/if}
        </Button>
    </div>
{/if}
