<script lang="ts">
    import { formatCurrency, localize, parseCurrency } from '@core/i18n'
    import { getMarketAmountFromAssetValue } from '@core/market/utils'
    import { activeProfile } from '@core/profile'
    import { getMaxDecimalsFromTokenMetadata } from '@core/token/utils'
    import {
        IAsset,
        TokenStandard,
        convertToRawAmount,
        formatTokenAmountBestMatch,
        formatTokenAmountDefault,
        getRequiredStorageDepositForMinimalBasicOutput,
        getUnitFromTokenMetadata,
        visibleSelectedWalletAssets,
    } from '@core/wallet'
    import Big from 'big.js'
    import { AmountInput, AssetDropdown, InputContainer, SliderInput, Text, TooltipIcon } from 'shared/components'
    import UnitInput from './UnitInput.svelte'

    export let inputElement: HTMLInputElement = undefined
    export let disabled = false
    export let isFocused = false
    export let votingPower: number = 0
    export let asset: IAsset = $visibleSelectedWalletAssets?.[$activeProfile?.network?.id]?.baseCoin
    export let rawAmount: string = undefined
    export let unit: string = undefined
    export let containsSlider: boolean = false
    export let disableAssetSelection: boolean = null
    export let amount: string = rawAmount
        ? formatTokenAmountDefault(Number(rawAmount), asset?.metadata, unit, false)
        : undefined

    let amountInputElement: HTMLInputElement
    let error: string

    $: isFocused && (error = '')
    $: allowedDecimals = getMaxDecimalsFromTokenMetadata(asset?.metadata, unit)
    $: availableBalance = asset?.balance?.available + votingPower
    $: bigAmount = convertToRawAmount(amount, asset?.metadata, unit)
    $: marketAmount = getMarketAmountFromAssetValue(bigAmount, asset)
    $: max = parseCurrency(formatTokenAmountDefault(availableBalance, asset?.metadata, unit, false))
    $: rawAmount = bigAmount?.toString()

    function onClickAvailableBalance(): void {
        const isRawAmount = asset?.metadata?.decimals && getUnitFromTokenMetadata(asset?.metadata)
        if (isRawAmount) {
            const parsedAmount = formatTokenAmountDefault(availableBalance, asset?.metadata, unit, false)
            amount = parsedAmount
            return
        }
        amount = availableBalance.toString() ?? '0'
        unit = undefined
    }

    export async function validate(allowZeroOrNull = false): Promise<void> {
        try {
            const amountAsFloat = parseCurrency(amount)
            const isAmountZeroOrNull = !Number(amountAsFloat)
            const standard = asset?.metadata?.standard
            const remainderBalance = bigAmount && Number(Big(availableBalance)?.minus(bigAmount))
            // Calculate the minimum required storage deposit for a minimal basic output
            // This is used to check if the user is leaving dust behind that cant cover the storage deposit
            const minRequiredStorageDeposit = await getRequiredStorageDepositForMinimalBasicOutput()
            // Zero value transactions can still contain metadata/tags
            error = ''
            if (allowZeroOrNull && isAmountZeroOrNull) {
                rawAmount = Big(0).toString()
                return
            } else if (isAmountZeroOrNull) {
                throw new Error(localize('error.send.amountInvalidFormat'))
            } else if (
                ((standard === TokenStandard.BaseToken && unit === asset?.metadata?.subunit) ||
                    (unit === getUnitFromTokenMetadata(asset?.metadata) && asset?.metadata?.decimals === 0)) &&
                Number.parseInt(amount, 10).toString() !== amount
            ) {
                throw new Error(localize('error.send.amountNoFloat'))
            } else if (bigAmount?.gt(Big(availableBalance))) {
                throw new Error(localize('error.send.amountTooHigh'))
            } else if (bigAmount?.lte(Big(0))) {
                throw new Error(localize('error.send.amountZero'))
            } else if (!bigAmount?.mod(1).eq(Big(0))) {
                throw new Error(localize('error.send.amountSmallerThanSubunit'))
            } else if (
                standard === TokenStandard.BaseToken &&
                remainderBalance &&
                remainderBalance !== 0 &&
                remainderBalance < minRequiredStorageDeposit
            ) {
                // don't allow leaving dust(amount less than minimum required storage deposit) for base token
                throw new Error(
                    localize('error.send.leavingDust', {
                        values: {
                            minRequiredStorageDeposit: formatTokenAmountBestMatch(
                                minRequiredStorageDeposit,
                                asset?.metadata
                            ),
                        },
                    })
                )
            }
            rawAmount = bigAmount.toString()
        } catch (err) {
            error = err?.message ?? err
            return Promise.reject(error)
        }
    }
</script>

<InputContainer bind:this={inputElement} bind:inputElement={amountInputElement} col {isFocused} {error}>
    <div class="flex flex-row w-full items-center space-x-0.5 relative">
        <AssetDropdown bind:asset readonly={disableAssetSelection} />
        <AmountInput
            bind:inputElement={amountInputElement}
            bind:amount
            bind:hasFocus={isFocused}
            maxDecimals={allowedDecimals}
            isInteger={allowedDecimals === 0}
            clearBackground
            clearPadding
            clearBorder
            {disabled}
        />
        {#if getUnitFromTokenMetadata(asset?.metadata)}
            <UnitInput bind:unit bind:isFocused {disabled} tokenMetadata={asset?.metadata} />
        {/if}
    </div>
    {#if containsSlider}
        <div class="flex flex-col mt-5">
            <SliderInput bind:value={amount} {max} decimals={allowedDecimals} {disabled} />
            <div class="flex flex-row justify-between">
                <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                    >{formatTokenAmountDefault(0, asset?.metadata, unit)} {unit}</Text
                >
                <Text color="gray-800" darkColor="gray-500" fontSize="xs"
                    >{formatTokenAmountDefault(availableBalance, asset?.metadata, unit)} {unit}</Text
                >
            </div>
        </div>
    {:else}
        <div class="flex flex-row w-full items-end justify-between mt-2">
            {#if asset}
                <div class="flex flex-row items-center">
                    <button on:click={onClickAvailableBalance}>
                        <Text color="gray-600" darkColor="gray-500" fontSize="xs" classes="cursor-pointer">
                            {localize('general.availableBalanceWithValue', {
                                values: {
                                    balance: formatTokenAmountBestMatch(availableBalance, asset?.metadata),
                                },
                            })}
                        </Text>
                    </button>
                    <TooltipIcon
                        title={localize('general.availableBalance')}
                        text={localize('general.availableBalanceTooltip')}
                        width={15}
                        height={15}
                        classes="ml-1"
                    />
                </div>
            {/if}
            <!-- Placeholder for asset USD value  -->
            <Text color="gray-600" darkColor="gray-500" fontSize="xs">{formatCurrency(marketAmount) ?? ''}</Text>
        </div>
        <!-- else content here -->
    {/if}
</InputContainer>
