<script lang="typescript">
    import { Button, Checkbox, Input, Password, Text } from 'shared/components'
    import { DEFAULT_NODES, isNodeValid } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import type { ClientOptions, Node } from 'shared/lib/typings/client'
    import { api, wallet, WalletAccount } from 'shared/lib/wallet'

    export let locale

    const { accounts } = $wallet

    let url = ''
    let username = ''
    let password = ''
    let primary = false
    let addressError = ''
    let authError = ''
    let isBusy = false

    function addCustomNode(node: Node, primary = false) {
        addressError = ''

        const error = isNodeValid([...$activeProfile?.settings.customNodes, ...DEFAULT_NODES], node)

        if (error) {
            // TODO: Move locale to store and localise properly
            addressError = locale(error)
        } else {
            isBusy = true

            updateProfile('settings.customNodes', [...$activeProfile?.settings.customNodes, node])
            if (primary) {
                updateProfile('settings.node', node)
            }

            const options: ClientOptions = primary
                ? {
                      ...$accounts[0].clientOptions,
                      node,
                      nodes: [],
                  }
                : {
                      ...$accounts[0].clientOptions,
                      nodes: [...$accounts[0].clientOptions.nodes, node],
                  }

            api.setClientOptions(options, {
                onSuccess() {
                    accounts.update((_accounts) =>
                        _accounts.map((_account) => {
                            if (primary) {
                                return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                    {} as WalletAccount,
                                    _account,
                                    {
                                        clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                            {},
                                            _account.clientOptions,
                                            { node, nodes: [] }
                                        ),
                                    }
                                )
                            }

                            return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                {} as WalletAccount,
                                _account,
                                {
                                    clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                        {},
                                        _account.clientOptions,
                                        {
                                            nodes: [..._account.clientOptions.nodes, node],
                                        }
                                    ),
                                }
                            )
                        })
                    )

                    isBusy = false
                    closePopup()
                },
                onError(err) {
                    isBusy = false
                    closePopup()
                    showAppNotification({
                        type: 'error',
                        message: locale(err.error),
                    })
                },
            })
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.node.titleAdd')}</Text>
<div class="w-full h-full">
    <Input bind:value={url} placeholder={locale('popups.node.nodeAddress')} error={addressError} disabled={isBusy} autofocus />
    <Input
        classes="mt-3"
        bind:value={username}
        placeholder={locale('popups.node.optionalUsername')}
        error={authError}
        disabled={isBusy} />
    <Password classes="mt-3" bind:value={password} placeholder={locale('popups.node.optionalPassword')} disabled={isBusy} />
    <Checkbox classes="my-8" label={locale('popups.node.setAsPrimaryNode')} bind:checked={primary} disabled={isBusy} />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.cancel')}</Button>
    <Button
        disabled={!url || isBusy}
        classes="w-1/2"
        onClick={() => addCustomNode({ url, auth: { username, password } }, primary)}>
        {locale('actions.addNode')}
    </Button>
</div>
