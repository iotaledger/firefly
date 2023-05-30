<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    import { Animation, Button, CopyableBox, FontWeight, Pane, Text, TextType } from '@ui'
    import { selectedAccount, updateSelectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { loadEvmAddressForSelectedAccount } from '@core/layer-2'
    import { DrawerRoute, NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'
    import DrawerTemplate from './DrawerTemplate.svelte'
    import { Router } from '@core/router'

    export let drawerRouter: Router<DrawerRoute>

    $: address = $selectedAccount?.evmAddress

    let continued = false

    function onContinueClick(): void {
        continued = true
        $networkConfigRouter.reset()
        $networkConfigRouter.goTo(NetworkConfigRoute.ConnectedChains)
    }

    function onMountHelper(): void {
        loadEvmAddressForSelectedAccount()
    }

    onMount(() => void onMountHelper())

    onDestroy(() => {
        if (!continued) {
            updateSelectedAccount({ evmAddress: null })
        }
    })
</script>

<DrawerTemplate title={localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.title')} {drawerRouter}>
    <confirm-ledger-evm-address-drawer class="flex flex-col justify-between w-full h-full">
        <div class="flex flex-col self-center">
            <Animation animation="ledger-prompt-confirmed-desktop" />
            <Text type={TextType.h4}
                >{localize('views.dashboard.drawers.networkConfig.confirmLedgerEvmAddress.header')}</Text
            >
            <Pane classes="mt-6">
                <CopyableBox value={address ?? '---'} classes="bg-transparent w-full">
                    <div class="w-full text-left">
                        <Text fontWeight={FontWeight.medium} fontSize="13" color="gray-600"
                            >{localize('general.evmAddress')}</Text
                        >
                        <Text type={TextType.pre} fontWeight={FontWeight.medium} fontSize="15" classes="break-words"
                            >{address ?? '---'}</Text
                        >
                    </div>
                </CopyableBox>
            </Pane>
        </div>
        <Button outline disabled={!address} onClick={onContinueClick}>{localize('actions.continue')}</Button>
    </confirm-ledger-evm-address-drawer>
</DrawerTemplate>
