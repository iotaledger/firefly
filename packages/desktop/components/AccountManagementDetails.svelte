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
        TextHint,
        TextHintVariant,
    } from '@ui'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { AccountManagementMenu } from './modals'
    import {
        formatTokenAmountBestMatch,
        AddressConverter,
        isAccountOutput,
        isImplicitAccountOutput,
        selectedWallet,
        selectedWalletMainAccountId,
        hasWalletMainAccountNegativeBIC,
    } from '@core/wallet'
    import {
        AccountAddress,
        AccountOutput,
        FeatureType,
        OutputData,
        BlockIssuerFeature,
        Ed25519PublicKeyHashBlockIssuerKey,
        BlockIssuerKeyType,
        StakingFeature,
    } from '@iota/sdk/out/types'
    import { openUrlInBrowser } from '@core/app'
    import { DEFAULT_MANA, ExplorerEndpoint, getOfficialExplorerUrl } from '@core/network'
    import { activeProfile, getBaseToken } from '@core/profile'
    import { PopupId, openPopup } from '@auxiliary/popup'

    export let selectedOutput: OutputData

    let modal: Modal
    let address: string = ''
    let keys: string[] = []

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)

    $: isImplicitAccount = isImplicitAccountOutput(selectedOutput)
    $: accountId = isAccountOutput(selectedOutput) ? (selectedOutput.output as AccountOutput)?.accountId : null
    $: address = accountId ? AddressConverter.addressToBech32(new AccountAddress(accountId)) : null
    $: isMainAccount = accountId && accountId === $selectedWalletMainAccountId
    $: implicitAccountBalance = isImplicitAccount ? getImplicitAccountBalance(selectedOutput) : undefined
    $: formattedImplicitAccountBalance = implicitAccountBalance
        ? formatTokenAmountBestMatch(implicitAccountBalance, getBaseToken())
        : '-'
    $: hasStakingFeature = hasOutputStakingFeature(selectedOutput)
    $: rawStakedAmount = getStakedAmount(selectedOutput)
    $: formattedStakedAmount = formatTokenAmountBestMatch(rawStakedAmount, getBaseToken())
    $: primaryKey = $selectedWallet?.primaryKey
    $: listBlockKeysFeature(selectedOutput)
    $: hasMainAccountNegativeBIC = hasWalletMainAccountNegativeBIC($selectedWallet)
    $: hasAccountNegativeBIC =
        $selectedWallet?.balances?.blockIssuanceCredits?.[(selectedOutput.output as AccountOutput)?.accountId] < 0

    function getImplicitAccountBalance(outputData: OutputData): number | undefined {
        return Number(outputData.output.amount)
    }

    function onExplorerClick(): void {
        if (!selectedOutput?.outputId) return
        const url = `${explorerUrl}/${ExplorerEndpoint.Output}/${selectedOutput.outputId.toString()}`
        openUrlInBrowser(url)
    }

    function handleActivateAccount(): void {
        openPopup({
            id: PopupId.ActivateAccount,
            props: { outputId: selectedOutput?.outputId },
        })
    }

    function listBlockKeysFeature(outputData: OutputData): void {
        if (isImplicitAccount) return
        const accountOutput = outputData?.output as AccountOutput
        const feature = accountOutput?.features?.find(
            (feature) => feature.type === FeatureType.BlockIssuer
        ) as BlockIssuerFeature
        const allKeys: string[] = []

        if (feature) {
            feature.blockIssuerKeys.forEach((key) => {
                if (key.type === BlockIssuerKeyType.Ed25519PublicKeyHash) {
                    allKeys.push((key as Ed25519PublicKeyHashBlockIssuerKey).pubKeyHash)
                }
            })
        }
        keys = allKeys
    }

    function hasOutputStakingFeature(output: OutputData): boolean {
        return (
            isAccountOutput(output) &&
            (output.output as AccountOutput).features?.some((feature) => feature.type === FeatureType.Staking)
        )
    }

    function getStakedAmount(outputData: OutputData): number | undefined {
        if (!hasStakingFeature) return
        let amount = 0
        const accountOutput = outputData.output as AccountOutput
        if (accountOutput.features) {
            const stakingFeature = accountOutput.features.find(
                (feature) => feature.type === FeatureType.Staking
            ) as StakingFeature
            amount = Number(stakingFeature?.stakedAmount)
        }
        return amount
    }

    function formatBIC(amount: number): string {
        if (amount < 0) {
            return '-' + formatTokenAmountBestMatch(amount * -1, DEFAULT_MANA)
        } else {
            return formatTokenAmountBestMatch(amount, DEFAULT_MANA)
        }
    }
</script>

<right-pane class="w-full h-full min-h-96 flex-1 space-y-4 flex flex-col">
    <Pane height={Height.Full}>
        <right-pane-container class="flex flex-col justify-between h-full">
            <right-pane-wrapper class="flex flex-col space-y-8 h-full">
                <right-pane-title class="flex flex-col space-y-1">
                    <title-container class="flex justify-between w-full items-center">
                        <title-wrapper class="flex items-center space-x-2 py-1">
                            <Text type={TextType.h2}>{localize('views.accountManagement.list.tile.title')}</Text>
                            {#if isImplicitAccount}
                                <Pill backgroundColor="yellow-200" textColor="yellow-900"
                                    >{localize('views.accountManagement.list.tile.pill.pending')}</Pill
                                >
                            {:else if isMainAccount}
                                <Pill backgroundColor="blue-200" textColor="blue-600"
                                    >{localize('views.accountManagement.list.tile.pill.main')}
                                </Pill>
                            {/if}
                        </title-wrapper>

                        {#if accountId}
                            <wallet-actions-button class="block relative">
                                <MeatballMenuButton onClick={modal?.toggle} />
                                <AccountManagementMenu
                                    bind:modal
                                    position={{ right: '0' }}
                                    classes="mt-1.5"
                                    {accountId}
                                    {keys}
                                />
                            </wallet-actions-button>
                        {/if}
                        {#if isImplicitAccount}
                            <Button size={ButtonSize.Small} onClick={handleActivateAccount}
                                >{localize('views.implicit-account-creation.steps.step2.view.action')}</Button
                            >
                        {/if}
                    </title-container>
                    {#if selectedOutput.outputId}
                        <button
                            class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
                            on:click={onExplorerClick}
                        >
                            {localize('general.viewOnExplorer')}
                        </button>
                    {/if}
                </right-pane-title>
                <div class="flex flex-row space-x-2 {isImplicitAccount ? 'w-full' : 'w-1/2'}">
                    {#if isImplicitAccount}
                        <Tile>
                            <div class="flex flex-col space-y-2 items-center justify-center w-full">
                                <Text type={TextType.h3}>
                                    {formattedImplicitAccountBalance}
                                </Text>
                                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                    >{localize('views.accountManagement.details.balance')}</Text
                                >
                            </div>
                        </Tile>
                    {/if}

                    {#if hasStakingFeature}
                        <Tile>
                            <div class="flex flex-col space-y-2 items-center justify-center w-full">
                                <Text type={TextType.h3}>{formattedStakedAmount}</Text>
                                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                    >{localize('views.accountManagement.details.staked')}</Text
                                >
                            </div>
                        </Tile>
                    {/if}

                    {#if accountId}
                        <Tile>
                            <div class="flex flex-col space-y-2 items-center justify-center w-full">
                                <Text type={TextType.h3}>
                                    {formatBIC($selectedWallet?.balances?.blockIssuanceCredits?.[accountId]) ?? 0}
                                </Text>
                                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                    >{localize('views.accountManagement.details.blockIssuanceCredits')}</Text
                                >
                            </div>
                        </Tile>
                    {/if}
                    {#if isImplicitAccount}
                        <Tile>
                            <div class="flex flex-col space-y-2 items-center justify-center w-full">
                                <Text type={TextType.h3}>
                                    {formatTokenAmountBestMatch(selectedOutput.output?.mana, DEFAULT_MANA)}</Text
                                >
                                <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                    >{localize('views.accountManagement.details.mana')}</Text
                                >
                            </div>
                        </Tile>
                    {/if}
                </div>
                {#if accountId}
                    <div class="flex flex-col space-y-2">
                        <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                            >{localize('views.accountManagement.details.address')}</Text
                        >
                        <CopyableBox
                            clearBackground
                            clearBoxPadding
                            isCopyable
                            value={address}
                            classes="flex space-x-2 items-center"
                        >
                            <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start"
                                >{address}</Text
                            >
                            <Icon icon={IconEnum.Copy} classes="text-blue-500" width={24} height={24} />
                        </CopyableBox>
                    </div>
                {/if}
                {#if accountId && primaryKey}
                    <div class="flex flex-col space-y-2">
                        <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                            >{localize('views.accountManagement.details.key')}</Text
                        >
                        <Text type={TextType.pre} fontSize="13" lineHeight="leading-120" classes="text-start"
                            >{primaryKey}</Text
                        >
                    </div>
                {/if}
            </right-pane-wrapper>
            {#if isMainAccount && hasMainAccountNegativeBIC}
                <TextHint
                    variant={TextHintVariant.Danger}
                    text={localize('views.accountManagement.details.mainAccountNegativeBICHint')}
                />
            {/if}
            {#if !isMainAccount && hasAccountNegativeBIC}
                <TextHint
                    variant={TextHintVariant.Danger}
                    text={localize('views.accountManagement.details.accountNegativeBICHint')}
                />
            {/if}
        </right-pane-container>
    </Pane>
</right-pane>
