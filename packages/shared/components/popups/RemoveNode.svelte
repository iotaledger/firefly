<script lang="typescript">
    import { Button, Text } from 'shared/components'
    import { DEFAULT_NODE } from 'shared/lib/network'
    import { showAppNotification } from 'shared/lib/notifications'
    import { closePopup } from 'shared/lib/popup'
    import { activeProfile, updateProfile } from 'shared/lib/profile'
    import type { ClientOptions } from 'shared/lib/typings/client'
    import { api, wallet, WalletAccount } from 'shared/lib/wallet'

    export let locale

    const { accounts } = $wallet

    let isBusy = false

    function removeCustomNode() {
        isBusy = true

        const url = $activeProfile.settings.node.url

        updateProfile('settings.node', DEFAULT_NODE)
        updateProfile(
            'settings.customNodes',
            $activeProfile.settings.customNodes.filter((n) => n.url !== url)
        )

        api.setClientOptions(
            {
                node: DEFAULT_NODE,
                nodes: [],
            },
            {
                onSuccess() {
                    accounts.update((_accounts) =>
                        _accounts.map((_account) => {
                            return Object.assign<WalletAccount, WalletAccount, Partial<WalletAccount>>(
                                {} as WalletAccount,
                                _account,
                                {
                                    clientOptions: Object.assign<ClientOptions, ClientOptions, ClientOptions>(
                                        {},
                                        _account.clientOptions,
                                        {
                                            node: DEFAULT_NODE,
                                            nodes: [],
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
            }
        )
    }
</script>

<Text type="h4" classes="mb-5">{locale('popups.node.title_remove')}</Text>
<div class="w-full h-full mb-5">
    <Text>{locale('popups.node.remove_confirmation')}</Text>
</div>
<div class="flex flex-row justify-between space-x-4 w-full px-8 ">
    <Button secondary classes="w-1/2" onClick={() => closePopup()} disabled={isBusy}>{locale('actions.no')}</Button>
    <Button disabled={isBusy} classes="w-1/2" onClick={() => removeCustomNode()}>{locale('actions.yes')}</Button>
</div>
