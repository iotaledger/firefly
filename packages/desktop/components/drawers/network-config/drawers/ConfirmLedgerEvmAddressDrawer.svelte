<script lang="ts">
    import { onMount } from 'svelte'
    import { Animation, Button, CopyableBox, FontWeight, Pane, Text, TextType } from '@ui'
    import { selectedAccount } from '@core/account'
    import { localize } from '@core/i18n'
    import { loadEvmAddressForSelectedAccount } from '@core/layer-2'
    import { NetworkConfigRoute, networkConfigRouter } from '@desktop/routers'

    onMount(() => void onMountHelper())

    $: address = $selectedAccount?.evmAddress

    async function onMountHelper(): Promise<void> {
        await loadEvmAddressForSelectedAccount()
    }

    function onContinueClick(): void {
        $networkConfigRouter.reset()
        $networkConfigRouter.goTo(NetworkConfigRoute.ConnectedChains)
    }
</script>

<div class="flex flex-col justify-between w-full h-full">
    <div class="flex flex-col self-center">
        <Animation animation="ledger-prompt-confirmed-desktop" />
        <Text type={TextType.h4}>We have generated your EVM address</Text>
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
    <Button outline disabled={!address} onClick={onContinueClick}>Continue</Button>
</div>
