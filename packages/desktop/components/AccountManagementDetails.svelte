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
        selectedWallet,
    } from '@core/wallet'
    import { onMount } from 'svelte'
    import { getBaseToken } from '@core/profile'
    import { AccountAddress, AccountOutput, CommonOutput, OutputData } from '@iota/sdk/out/types'

    export let selectedAccountOutput: OutputData
    export let index: number

    let modal: Modal
    let totalBalance: number = 0
    let address: string = ''

    const accountId: string = (selectedAccountOutput?.output as AccountOutput)?.accountId

    async function getTotalBalanceOfAnAccount(accountId: string): Promise<number> {
        const allOutputs = await $selectedWallet?.outputs({ accountIds: [accountId] })
        const totalBalance = allOutputs?.reduce((acc, outputObj) => acc + Number(outputObj.output.amount), 0)
        return totalBalance
    }

    onMount(async () => {
        totalBalance = await getTotalBalanceOfAnAccount((selectedAccountOutput?.output as AccountOutput)?.accountId)
    })
    $: isImplicitAccount = isImplicitAccountOutput(selectedAccountOutput.output as CommonOutput)
    $: isAccountOuput = isAccountOutput(selectedAccountOutput)
    $: address = getBech32AddressFromAddressTypes(new AccountAddress(accountId))
</script>

<right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
    <Pane height={Height.Full}>
        <right-pane-container class="flex flex-col space-y-10 h-full">
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
            <div class="flex flex-row space-x-2 w-1/2">
                <Tile>
                    <div class="flex flex-col space-y-2 items-center justify-center w-full">
                        <Text type={TextType.h3}>{formatTokenAmountBestMatch(totalBalance, getBaseToken())}</Text>
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
            <div class="flex flex-col space-y-2 w-1/2">
                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}>Mana</Text>
                <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start w-[260px]"
                    >{selectedAccountOutput?.output?.mana}</Text
                >
            </div>
        </right-pane-container>
    </Pane>
</right-pane>
