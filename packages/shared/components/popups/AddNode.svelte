<script lang="typescript">
    import { get } from 'svelte/store'
    import { Button, Checkbox, Input, Password, Spinner, Text } from 'shared/components'
    import SwitchNetwork from './SwitchNetwork.svelte'
    import { stripSpaces, stripTrailingSlash } from 'shared/lib/helpers'
    import { cleanNodeAuth, getNetworkById, checkNodeUrlValidity } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { asyncGetNodeInfo, wallet } from 'shared/lib/wallet'
    import { activeProfile } from 'shared/lib/profile'
    import { updateNetworkStatus } from '../../lib/networkStatus'

    import { Locale } from '@core/i18n'
    import { Node, NodeAuth, NodeInfo } from 'shared/lib/typings/node'
    import { Network } from 'shared/lib/typings/network'
    import { mobile, isKeyboardOpened, keyboardHeight } from 'shared/lib/app'

    export let locale: Locale

    export let node: Node = { url: '', isPrimary: false }
    export let nodes: Node[] = []
    export let network: Network
    export let isAddingNode: boolean = true

    export let onSuccess = (..._: any[]): void => {}

    const { accounts } = $wallet

    let nodeUrl: string = node?.url || ''
    const oldNodeUrl: string = nodeUrl
    const optNodeAuth: NodeAuth = node?.auth || { username: '', password: '', jwt: '' }

    let addressError = ''
    let addressWarn = ''
    const authError = ''

    let isBusy = false
    let isSuccess = true
    let isNetworkSwitch = false
    let newNetwork: Network

    $: nodeUrl, (addressError = '')
    $: {
        addressWarn = ''
        node.url = stripSpaces(node.url)
        if (!$activeProfile?.isDeveloperProfile && /^http:\/\//.exec(node.url)) {
            addressWarn = locale('warning.node.http')
        }
    }

    const cleanNodeUrl = (_url: string): string => stripTrailingSlash(stripSpaces(_url))

    const constructNodes = (): Node[] =>
        node ? nodes.filter((n) => cleanNodeUrl(node.url) !== cleanNodeUrl(n.url)) : nodes

    const cleanNodeFormData = (): void => {
        const _nodes = constructNodes()
        const validErr = checkNodeUrlValidity(_nodes, cleanNodeUrl(nodeUrl), $activeProfile.isDeveloperProfile)
        if (validErr) {
            addressError = locale(validErr)
        }
    }

    const checkNetworkId = (id: string): void => {
        if (!id) {
            addressError = locale('error.network.notReachable')
        } else if (id !== network.id) {
            if ($activeProfile.isDeveloperProfile) {
                newNetwork = getNetworkById(id)
                isNetworkSwitch = true
            } else {
                addressError = locale('error.network.mismatch', { values: { networkId: id } })
            }
        }
    }

    const handleAddNodeClick = async (): Promise<void> => {
        isBusy = true
        addressError = ''

        let nodeInfo: NodeInfo

        try {
            if (node) {
                cleanNodeFormData()

                if (!addressError) {
                    nodeInfo = await asyncGetNodeInfo(
                        $accounts[0].id,
                        cleanNodeUrl(nodeUrl),
                        cleanNodeAuth(optNodeAuth)
                    )

                    checkNetworkId(nodeInfo?.nodeinfo?.networkId)
                }
            }
        } catch (err) {
            isBusy = false
            isSuccess = false

            showAppNotification({
                type: 'error',
                message: locale(err?.error),
            })

            return
        }

        if (!addressError) {
            if (!isNetworkSwitch) {
                await updateNetworkStatus(get($wallet.accounts)[0]?.id, <Node>{
                    url: nodeUrl,
                    auth: optNodeAuth,
                    isPrimary: node?.isPrimary,
                })
                    .then(() => {
                        isBusy = false

                        onSuccess(
                            false,
                            {
                                url: cleanNodeUrl(nodeUrl),
                                auth: optNodeAuth,
                                network: getNetworkById(nodeInfo?.nodeinfo.networkId),
                                isPrimary: node?.isPrimary || false,
                            },
                            oldNodeUrl
                        )
                        closePopup()
                    })
                    .catch((err) => {
                        isBusy = false
                        return
                    })
            }
        }

        isBusy = false
    }
</script>

{#if isNetworkSwitch}
    <SwitchNetwork
        {locale}
        network={newNetwork}
        node={{ url: cleanNodeUrl(nodeUrl), auth: optNodeAuth, isPrimary: true }}
    />
{:else}
    <Text type="h4" classes="mb-6 {$mobile && 'text-center -mt-4'}"
        >{locale(`popups.node.title${isAddingNode ? 'Add' : 'Update'}`)}</Text
    >
    <form id="node-config-form" class="w-full h-full">
        <Input
            bind:value={nodeUrl}
            placeholder={locale('popups.node.nodeAddress')}
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
            placeholder={locale('popups.node.optionalUsername')}
            error={authError}
            disabled={isBusy}
        />
        <Password
            classes="mt-3"
            bind:value={optNodeAuth.password}
            placeholder={locale('popups.node.optionalPassword')}
            disabled={isBusy}
        />
        <Password
            classes="mt-3"
            bind:value={optNodeAuth.jwt}
            placeholder={locale('popups.node.optionalJwt')}
            disabled={isBusy}
        />
        <Checkbox
            label={locale('popups.node.setAsPrimaryNode')}
            bind:checked={node.isPrimary}
            disabled={isBusy}
            classes="mt-4 mb-8"
        />
    </form>
    <div
        class="flex flex-row justify-between space-x-4 w-full md:px-8 "
        style="padding-bottom: {$mobile && $isKeyboardOpened
            ? $keyboardHeight - 20
            : 0}px; transition: padding-bottom 0.2s var(--transition-scroll)"
    >
        <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>
            {locale('actions.cancel')}
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
                    message={locale(`popups.node.${isAddingNode ? 'addingNode' : 'updatingNode'}`)}
                    classes="justify-center"
                />
            {:else}
                {locale(`actions.${isAddingNode ? 'addNode' : 'updateNode'}`)}
            {/if}
        </Button>
    </div>
{/if}
