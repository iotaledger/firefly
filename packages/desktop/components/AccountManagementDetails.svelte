<script lang="ts">
    import { localize } from '@core/i18n'
    import {
        Modal,
        MeatballMenuButton,
        Height,
        Pane,
        TextType,
        Text,
        Tile,
        FontWeight,
        CopyableBox,
        Icon,
        Pill,
        Button,
        ButtonSize,
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AccountManagementMenu } from './modals'
    import {
        formatTokenAmountBestMatch,
        getBech32AddressFromAddressTypes,
        isAccountOutput,
        isImplicitAccountOutput,
    } from '@core/wallet'
    import { AccountAddress, AccountOutput, CommonOutput, OutputData } from '@iota/sdk/out/types'
    import { openUrlInBrowser } from '@core/app'
    import { ExplorerEndpoint, getOfficialExplorerUrl } from '@core/network'
    import { activeProfile, getBaseToken } from '@core/profile'

    export let selectedOutput: OutputData
    export let index: number

    let modal: Modal
    let address: string = ''

    const accountId: string = (selectedOutput?.output as AccountOutput)?.accountId
    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: isImplicitAccount = isImplicitAccountOutput(selectedOutput.output as CommonOutput)
    $: isAccountOuput = isAccountOutput(selectedOutput)
    $: address = getBech32AddressFromAddressTypes(new AccountAddress(accountId))

    function onExplorerClick(): void {
        let url: string
        url = `${explorerUrl}/${ExplorerEndpoint.Output}/${selectedOutput.outputId.toString()}`
        openUrlInBrowser(url)
    }
</script>

<right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
    <Pane height={Height.Full}>
        <right-pane-container class="flex flex-col space-y-8 h-full">
            <right-pane-title class="flex flex-col space-y-1">
                <title-container class="flex justify-between w-full items-center">
                    <title-wrapper class="flex items-center space-x-2 py-1">
                        <Text type={TextType.h2}>{localize('views.accountManagement.list.tile.title')} {index}</Text>
                        {#if isImplicitAccount}
                            <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                            >
                        {:else}
                            <Pill backgroundColor="blue-200" textColor="blue-600"
                                >{localize('views.accountManagement.list.tile.pill.main')}
                            </Pill>
                        {/if}
                    </title-wrapper>

                    {#if isAccountOuput}
                        <wallet-actions-button class="block relative">
                            <MeatballMenuButton onClick={modal?.toggle} />
                            <AccountManagementMenu bind:modal position={{ right: '0' }} classes="mt-1.5" {accountId} />
                        </wallet-actions-button>
                    {/if}
                    {#if isImplicitAccount}
                        <Button size={ButtonSize.Small} onClick={() => {}}
                            >{localize('views.implicit-account-creation.steps.step2.view.action')}</Button
                        >
                    {/if}
                </title-container>
                <button
                    class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
                    on:click={onExplorerClick}
                >
                    {localize('general.viewOnExplorer')}
                </button>
            </right-pane-title>
            <div class="flex flex-row space-x-2 w-1/2">
                <Tile>
                    <div class="flex flex-col space-y-2 items-center justify-center w-full">
                        <!-- TODO: Replace this with the actual balance for accountOutputs-->
                        <Text type={TextType.h3}
                            >{isImplicitAccount
                                ? formatTokenAmountBestMatch(Number(selectedOutput.output.amount), getBaseToken())
                                : 0 + ' Gi'}</Text
                        >
                        <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                            >{localize('views.accountManagement.details.balance')}</Text
                        >
                    </div>
                </Tile>

                <Tile>
                    <div class="flex flex-col space-y-2 items-center justify-center w-full">
                        <!-- TODO: Replace this with the actual staked amount -->
                        <Text type={TextType.h3}>0i</Text>
                        <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                            >{localize('views.accountManagement.details.staked')}</Text
                        >
                    </div>
                </Tile>
            </div>
            {#if isAccountOuput}
                <div class="flex flex-col space-y-2 w-1/2">
                    <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}>Address</Text>
                    <CopyableBox
                        clearBackground
                        clearBoxPadding
                        isCopyable
                        value={address}
                        classes="flex space-x-2 items-center"
                    >
                        <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start w-[260px]"
                            >{address}</Text
                        >
                        <Icon icon={IconEnum.Copy} classes="text-blue-500" width={24} height={24} />
                    </CopyableBox>
                </div>
            {/if}
            {#if isImplicitAccount}
                <div class="flex flex-col space-y-2 w-1/2">
                    <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}>Mana</Text>
                    <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start w-[260px]"
                        >{selectedOutput?.output?.mana}</Text
                    >
                </div>
            {/if}
        </right-pane-container>
    </Pane>
</right-pane>
