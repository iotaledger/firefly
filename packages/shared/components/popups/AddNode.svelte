<script lang="typescript">
    import type { ClientOptions, Node } from 'lib/typings/client'
    import { Button, Checkbox, Input, Password, Text } from 'shared/components'
    import { DEFAULT_NODE, DEFAULT_NODES, isNodeValid } from 'shared/lib/network'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import { api, wallet, WalletAccount } from 'shared/lib/wallet'

    export let locale

    const { accounts } = $wallet

    let url = ''
    let username = ''
    let password = ''
    let primary = false
    let addressError = ''
    let authError = ''

    function addCustomNode(node: Node, primary = false) {
        if (isNodeValid([...$activeProfile.settings.customNodes, ...DEFAULT_NODES], node)) {
            const options: ClientOptions = primary
                ? {
                      ...$accounts[0].clientOptions,
                      node: node.url,
                      nodes: [],
                  }
                : {
                      ...$accounts[0].clientOptions,
                      nodes: [...$accounts[0].clientOptions.nodes, node.url],
                  }

            api.setClientOptions(options, {
                onSuccess() {
                    updateProfile('settings.customNodes', [...$activeProfile.settings.customNodes, DEFAULT_NODE])

                    if (primary) {
                        updateProfile('settings.node', node)
                    }

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
                                            { node: node.url, nodes: [] }
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
                                            nodes: [..._account.clientOptions.nodes, node.url],
                                        }
                                    ),
                                }
                            )
                        })
                    )

                    closePopup()
                },
                onError(error) {
                    // TODO: Add auth error handling
                    console.error(error)
                },
            })
        } else {
            console.error('Node is not valid')
        }
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.node.title_add')}</Text>
<div class="w-full h-full">
    <Input bind:value={url} placeholder={locale('popups.node.node_address')} error={addressError} />
    <Input classes="mt-3" bind:value={username} placeholder={locale('popups.node.optional_username')} error={authError} />
    <Password classes="mt-3" bind:value={password} placeholder={locale('popups.node.optional_password')} />
    <Checkbox classes="my-8" label={locale('popups.node.set_as_primary_node')} bind:checked={primary} />
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()}>{locale('actions.cancel')}</Button>
    <Button disabled={!url} classes="w-1/2" onClick={() => addCustomNode({ url, auth: { username, password } }, primary)}>
        {locale('actions.add_node')}
    </Button>
</div>
