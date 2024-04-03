<script lang="ts">
    import { localize } from '@core/i18n'
    import { selectedWallet } from '@core/wallet/stores'
    import {
        Height,
        Width,
        Pane,
        Button,
        Tile,
        Text,
        TextType,
        FontWeight,
        ButtonSize,
        CopyableBox,
        BoxedIconWithText,
        PingingBadge,
        TextHintVariant,
    } from '@ui'
    import { activeProfile, checkActiveProfileAuth } from '@core/profile'
    import {
        formatTokenAmountBestMatch,
        AddressConverter,
        getDefaultTransactionOptions,
        selectedWalletAssets,
        EMPTY_HEX_ID,
        getOutputRewards,
        getCommitteeInfo,
    } from '@core/wallet'
    import { truncateString } from '@core/utils'
    import { Icon as IconEnum } from '@auxiliary/icon'
    import { OutputType, DelegationOutput, OutputData, DelegationId } from '@iota/sdk/out/types'
    import { PopupId, closePopup, openPopup } from '@auxiliary/popup'
    import features from '@features/features'
    import { api } from '@core/api'
    import { DEFAULT_MANA, getOfficialExplorerUrl } from '@core/network'
    import { openUrlInBrowser } from '@core/app'

    let delegationData: IDelegationTable[] = []
    let currentEpoch = 0
    let committeeAddresses: string[] = []

    enum Header {
        DelegationId = 'delegationId',
        DelegatedFunds = 'delegatedFunds',
        Rewards = 'rewards',
        Epochs = 'epochs',
        DelegatedAddress = 'delegatedAddress',
        Action = 'action',
    }

    interface IDelegationTable {
        [Header.DelegationId]: string
        [Header.DelegatedFunds]: number
        [Header.Rewards]: number
        [Header.Epochs]: number
        [Header.DelegatedAddress]: string
        [Header.Action]: () => void
    }

    $: delegationOutputs =
        $selectedWallet?.walletUnspentOutputs?.filter((output) => output?.output?.type === OutputType.Delegation) || []
    $: delegationOutputs?.length > 0 && setCurrentEpochAndCommittee()
    $: delegationOutputs?.length > 0 && currentEpoch && buildMappedDelegationData(delegationOutputs)
    $: ({ baseCoin } = $selectedWalletAssets[$activeProfile?.network.id])

    $: rawDelegatedAmount = delegationOutputs.reduce((acc, prev) => acc + Number(prev.output.amount), 0)
    $: formattedDelegated = formatTokenAmountBestMatch(rawDelegatedAmount, baseCoin.metadata)

    $: rawUndelegatedAmount = Number($selectedWallet?.balances?.baseCoin?.available) - rawDelegatedAmount
    $: formattedUndelegated = formatTokenAmountBestMatch(rawUndelegatedAmount, baseCoin.metadata)

    $: rawRewardsAmount = delegationData.reduce((acc, prev) => acc + prev.rewards, 0)
    $: formattedRewards = formatTokenAmountBestMatch(rawRewardsAmount, DEFAULT_MANA)

    async function buildMappedDelegationData(delegationOutputs: OutputData[]): Promise<void> {
        const result =
            delegationOutputs?.map(async (output) => {
                const delegationOutput = output.output as DelegationOutput
                // Until the first epoch in which it was delegated ends, no rewards are obtained
                const epochsDelegating = currentEpoch - delegationOutput.startEpoch
                let delegationId: DelegationId = delegationOutput.delegationId
                if (delegationId === EMPTY_HEX_ID) {
                    delegationId = api.computeDelegationId(output.outputId)
                }
                const rewards = await getOutputRewards(output.outputId)
                return {
                    [Header.DelegationId]: delegationId,
                    [Header.DelegatedFunds]: Number(delegationOutput.delegatedAmount),
                    [Header.Rewards]: rewards,
                    [Header.Epochs]: epochsDelegating > 0 ? epochsDelegating : 0,
                    [Header.DelegatedAddress]: AddressConverter.addressToBech32(delegationOutput.validatorAddress),
                    [Header.Action]: () => handleClaimRewards(delegationId, rewards),
                }
            }) || []
        delegationData = await Promise.all(result)
    }

    async function setCurrentEpochAndCommittee(): Promise<void> {
        const committeeResponse = await getCommitteeInfo()
        currentEpoch = committeeResponse?.epoch
        committeeAddresses = committeeResponse?.committee?.map((committee) => committee.address) || []
    }

    function handleDelegate(): void {
        openPopup({
            id: PopupId.CreateDelegation,
        })
    }

    function handleClaimRewards(delegationId: string, rewards: number): void {
        openPopup({
            id: PopupId.Confirmation,
            props: {
                title: localize('popups.claimDelegationRewards.title'),
                description: localize('popups.claimDelegationRewards.description', {
                    values: { rewards, delegationId },
                }),
                confirmText: localize('popups.claimDelegationRewards.confirmButton'),
                variant: TextHintVariant.Success,
                onConfirm: async () => {
                    await checkActiveProfileAuth(
                        async () => {
                            await $selectedWallet.burn({ delegations: [delegationId] }, getDefaultTransactionOptions())
                            closePopup()
                        },
                        { stronghold: true }
                    )
                },
            },
        })
    }

    function renderCellValue(value: any, header: string): { component: any; props: any; text?: string; slot?: any } {
        switch (header as Header) {
            case Header.DelegationId:
                return {
                    component: CopyableBox,
                    props: {
                        value: value,
                        isCopyable: true,
                        clearBoxPadding: true,
                        clearBackground: true,
                        classes: 'text-gray-600 dark:text-white text-xs font-semibold',
                    },
                    text: truncateString(value, 5, 5, 3),
                }
            case Header.DelegatedFunds:
                return {
                    component: BoxedIconWithText,
                    props: {
                        icon: IconEnum.Lock,
                        text: baseCoin ? formatTokenAmountBestMatch(Math.round(value), baseCoin.metadata) : value,
                        boxClasses: 'bg-gray-100 w-6 h-6 rounded-full text-blue-500',
                        width: 20,
                        height: 20,
                    },
                }
            case Header.Rewards:
                return {
                    component: BoxedIconWithText,
                    props: {
                        icon: IconEnum.Star,
                        text: baseCoin ? formatTokenAmountBestMatch(Math.round(value), baseCoin.metadata) : value,
                        boxClasses: 'bg-orange-100 w-6 h-6 rounded-full text-orange-600',
                        width: 20,
                        height: 20,
                    },
                }
            case Header.Epochs:
                return {
                    component: Text,
                    props: { color: 'gray-600', fontWeight: FontWeight.medium, fontSize: '12', type: TextType.p },
                    text: localize('views.delegation.table.body.epochs', {
                        values: {
                            epochs: value,
                        },
                    }),
                }
            case Header.DelegatedAddress:
                return {
                    component: CopyableBox,
                    props: {
                        value: value,
                        isCopyable: true,
                        clearBoxPadding: true,
                        clearBackground: true,
                        classes: 'flex flex-row items-center text-gray-600 dark:text-white text-xs font-medium gap-2',
                    },
                    slot: {
                        component: PingingBadge,
                        props: {
                            classes: 'relative',
                            innerColor: committeeAddresses?.some((address) => address === value)
                                ? 'green-600'
                                : 'red-500',
                            outerColor: committeeAddresses?.some((address) => address === value)
                                ? 'green-400'
                                : 'red-300',
                        },
                    },
                    text: truncateString(value, 5, 5, 3),
                }
            case Header.Action:
                return {
                    component: Button,
                    props: { size: ButtonSize.Small, onClick: value, outline: true },
                    text: localize('popups.claimDelegationRewards.title'),
                }
            default:
                return {
                    component: Text,
                    props: { type: TextType.h3 },
                    text: value,
                }
        }
    }

    const explorerUrl = getOfficialExplorerUrl($activeProfile?.network?.id)
    function onExplorerClick(): void {
        openUrlInBrowser(explorerUrl)
    }
</script>

{#if $selectedWallet}
    <delegation-container class="w-full h-full flex flex-nowrap p-8 relative space-x-4 justify-center">
        <Pane height={Height.Full} width={Width.Full}>
            <div class="flex flex-col space-y-10 max-w-7xl w-full p-8">
                <div class="flex flex-row justify-between">
                    <div>
                        <Text type={TextType.h2}>{localize('views.delegation.title')}</Text>
                        <button
                            class="action w-max flex justify-start text-center font-medium text-14 text-blue-500"
                            on:click={onExplorerClick}
                        >
                            {localize('views.delegation.validators')}
                        </button>
                    </div>
                    <Button onClick={handleDelegate}>{localize('views.delegation.action.delegate')}</Button>
                </div>
                <div class="flex flex-row space-x-4 w-2/3">
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full text-center">
                            <Text type={TextType.h3}>{formattedDelegated}</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.delegated')}</Text
                            >
                        </div>
                    </Tile>
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full text-center">
                            <Text type={TextType.h3}>{formattedUndelegated}</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.undelegated')}</Text
                            >
                        </div>
                    </Tile>
                    <Tile>
                        <div class="flex flex-col space-y-2 items-center justify-center w-full text-center">
                            <Text type={TextType.h3}>{formattedRewards}</Text>
                            <Text color="gray-600" fontWeight={FontWeight.medium} fontSize="12" type={TextType.p}
                                >{localize('views.delegation.info.rewards')}</Text
                            >
                        </div>
                    </Tile>
                </div>
                {#if features.delegation.delegationList.enabled}
                    {#if delegationData.length > 0}
                        <table class="flex flex-col w-full space-y-4 h-80">
                            <thead class="w-full">
                                <tr class="flex flex-row justify-between align-items w-full">
                                    {#each Object.values(Header) as header}
                                        <th class="text-start flex-1">
                                            <Text
                                                color="gray-600"
                                                fontWeight={FontWeight.medium}
                                                fontSize="12"
                                                type={TextType.p}
                                                >{localize(`views.delegation.table.header.${header}`)}</Text
                                            >
                                        </th>
                                    {/each}
                                </tr>
                            </thead>
                            <tbody class="flex flex-col w-full space-y-4 scrollable-y">
                                {#each delegationData as data}
                                    <tr
                                        class="flex flex-row items-center w-full border-solid border-b border-gray-200 dark:border-gray-600 py-4"
                                    >
                                        {#each Object.entries(data) as [key, value]}
                                            {@const renderCell = renderCellValue(value, key)}
                                            <td class="text-start flex-1">
                                                {#if renderCell.text}
                                                    <svelte:component this={renderCell.component} {...renderCell.props}>
                                                        {#if renderCell.slot}
                                                            <svelte:component
                                                                this={renderCell.slot.component}
                                                                {...renderCell.slot.props}
                                                            />
                                                        {/if}
                                                        {renderCell.text}
                                                    </svelte:component>
                                                {:else}
                                                    <svelte:component
                                                        this={renderCell.component}
                                                        {...renderCell.props}
                                                    />
                                                {/if}
                                            </td>
                                        {/each}
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    {:else}
                        <div class="flex flex-col w-full items-center">
                            <Text secondary>{localize('views.delegation.table.emptyData')}</Text>
                        </div>
                    {/if}
                {/if}
            </div>
        </Pane>
    </delegation-container>
{/if}
